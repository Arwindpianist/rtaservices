import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';
import { hashPassword } from '@/lib/password';
import { normalizeRole, type AppRole } from '@/lib/rbac';
import { randomBytes } from 'crypto';
import { sendInviteEmail, sendPasswordResetEmail } from '@/lib/email';

export type AppUser = {
  id: string;
  name: string | null;
  email: string;
  role: AppRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type UserWithHash = AppUser & { passwordHash: string };
export type UserInvite = {
  id: string;
  email: string;
  name: string | null;
  role: AppRole;
  inviteToken: string;
  expiresAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  eventType: string;
  actorUserId: string | null;
  targetUserId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};
export type AuditQuery = {
  limit?: number;
  eventType?: string;
  actorUserId?: string;
  targetUserId?: string;
  from?: string;
  to?: string;
  q?: string;
};

function buildPublicAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

function makeToken(): string {
  return randomBytes(32).toString('hex');
}

async function mapUserByEmail(email: string): Promise<UserWithHash | null> {
  await ensureNeonSchema();
  const rows = await sql<UserWithHash[]>`
    SELECT id, name, email, role, is_active as "isActive",
           created_at as "createdAt", updated_at as "updatedAt",
           password_hash as "passwordHash"
    FROM app_users
    WHERE lower(email) = lower(${email})
    LIMIT 1
  `;
  if (!rows[0]) return null;
  rows[0].role = normalizeRole(rows[0].role);
  return rows[0];
}

export async function getUserByEmail(email: string): Promise<UserWithHash | null> {
  return mapUserByEmail(email);
}

export async function createUser(input: {
  name?: string;
  email: string;
  password: string;
  role?: AppRole;
}): Promise<AppUser> {
  await ensureNeonSchema();
  const passwordHash = await hashPassword(input.password);
  const role = normalizeRole(input.role);
  const rows = await sql<AppUser[]>`
    INSERT INTO app_users (name, email, password_hash, role, is_active)
    VALUES (${input.name ?? null}, ${input.email.toLowerCase()}, ${passwordHash}, ${role}, TRUE)
    RETURNING id, name, email, role, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
  `;
  rows[0].role = normalizeRole(rows[0].role);
  return rows[0];
}

export async function createUserInvite(input: {
  email: string;
  name?: string;
  role?: AppRole;
  invitedByUserId: string;
  expiresHours?: number;
}): Promise<{ invite: UserInvite; inviteLink: string }> {
  await ensureNeonSchema();
  const token = makeToken();
  const defaultHours = Number(process.env.INVITE_EXPIRES_HOURS_DEFAULT || '72');
  const expiresAt = new Date(Date.now() + (input.expiresHours ?? defaultHours) * 60 * 60 * 1000).toISOString();
  const rows = await sql<UserInvite[]>`
    INSERT INTO user_invites (email, name, role, invite_token, invited_by_user_id, expires_at)
    VALUES (${input.email.toLowerCase()}, ${input.name ?? null}, ${normalizeRole(input.role)}, ${token}, ${input.invitedByUserId}, ${expiresAt})
    RETURNING id, email, name, role, invite_token as "inviteToken", expires_at as "expiresAt",
              used_at as "usedAt", revoked_at as "revokedAt", created_at as "createdAt"
  `;
  const invite = { ...rows[0], role: normalizeRole(rows[0].role) };
  await logAuditEvent({
    eventType: 'invite.created',
    actorUserId: input.invitedByUserId,
    metadata: { email: invite.email, role: invite.role, inviteId: invite.id },
  });
  const inviteLink = `${buildPublicAppUrl()}/accept-invite?token=${invite.inviteToken}`;
  const tenantName = process.env.NEXT_PUBLIC_TENANT_NAME || 'RTA Services';
  await sendInviteEmail({ to: invite.email, inviteLink, tenantName });
  return { invite, inviteLink };
}

export async function listInvites(): Promise<UserInvite[]> {
  await ensureNeonSchema();
  const rows = await sql<UserInvite[]>`
    SELECT id, email, name, role, invite_token as "inviteToken", expires_at as "expiresAt",
           used_at as "usedAt", revoked_at as "revokedAt", created_at as "createdAt"
    FROM user_invites
    ORDER BY created_at DESC
  `;
  return rows.map((r) => ({ ...r, role: normalizeRole(r.role) }));
}

export async function consumeInvite(input: {
  token: string;
  password: string;
  name?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureNeonSchema();
  const now = Date.now();
  const inviteRows = await sql<UserInvite[]>`
    SELECT id, email, name, role, invite_token as "inviteToken", expires_at as "expiresAt",
           used_at as "usedAt", revoked_at as "revokedAt", created_at as "createdAt"
    FROM user_invites
    WHERE invite_token = ${input.token}
    LIMIT 1
  `;
  const invite = inviteRows[0];
  if (!invite) return { ok: false, error: 'Invalid invite token' };
  if (invite.usedAt) return { ok: false, error: 'Invite already used' };
  if (invite.revokedAt) return { ok: false, error: 'Invite revoked' };
  if (new Date(invite.expiresAt).getTime() < now) return { ok: false, error: 'Invite expired' };
  if (input.password.length < 8) return { ok: false, error: 'Password must be at least 8 characters' };

  const passwordHash = await hashPassword(input.password);
  const existing = await getUserByEmail(invite.email);
  if (existing) {
    await sql`
      UPDATE app_users
      SET name = ${input.name || invite.name || existing.name},
          role = ${normalizeRole(invite.role)},
          password_hash = ${passwordHash},
          is_active = TRUE,
          updated_at = NOW()
      WHERE id = ${existing.id}
    `;
  } else {
    await sql`
      INSERT INTO app_users (name, email, role, password_hash, is_active)
      VALUES (${input.name || invite.name || null}, ${invite.email}, ${normalizeRole(invite.role)}, ${passwordHash}, TRUE)
    `;
  }
  await sql`UPDATE user_invites SET used_at = NOW() WHERE id = ${invite.id}`;
  await logAuditEvent({
    eventType: 'invite.consumed',
    metadata: { inviteId: invite.id, email: invite.email },
  });
  return { ok: true };
}

export async function createPasswordResetToken(input: {
  userId: string;
  createdByUserId?: string;
  expiresMinutes?: number;
}): Promise<{ token: string; resetLink: string }> {
  await ensureNeonSchema();
  const token = makeToken();
  const defaultMinutes = Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES_DEFAULT || '60');
  const expiresAt = new Date(Date.now() + (input.expiresMinutes ?? defaultMinutes) * 60 * 1000).toISOString();
  await sql`
    INSERT INTO password_reset_tokens (user_id, reset_token, expires_at, created_by_user_id)
    VALUES (${input.userId}, ${token}, ${expiresAt}, ${input.createdByUserId ?? null})
  `;
  await logAuditEvent({
    eventType: 'password.reset_link.created',
    actorUserId: input.createdByUserId ?? null,
    targetUserId: input.userId,
  });
  const resetLink = `${buildPublicAppUrl()}/reset-password?token=${token}`;
  return { token, resetLink };
}

export async function requestPasswordResetByEmail(email: string): Promise<{ ok: true }> {
  await ensureNeonSchema();
  const user = await getUserByEmail(email);
  if (!user || !user.isActive) return { ok: true };
  const reset = await createPasswordResetToken({ userId: user.id });
  const tenantName = process.env.NEXT_PUBLIC_TENANT_NAME || 'RTA Services';
  await sendPasswordResetEmail({ to: user.email, resetLink: reset.resetLink, tenantName });
  return { ok: true };
}

export async function resetPasswordWithToken(input: {
  token: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureNeonSchema();
  if (input.password.length < 8) return { ok: false, error: 'Password must be at least 8 characters' };
  const rows = await sql<{ id: string; userId: string; expiresAt: string; usedAt: string | null }[]>`
    SELECT id, user_id as "userId", expires_at as "expiresAt", used_at as "usedAt"
    FROM password_reset_tokens
    WHERE reset_token = ${input.token}
    LIMIT 1
  `;
  const tokenRow = rows[0];
  if (!tokenRow) return { ok: false, error: 'Invalid reset token' };
  if (tokenRow.usedAt) return { ok: false, error: 'Reset token already used' };
  if (new Date(tokenRow.expiresAt).getTime() < Date.now()) return { ok: false, error: 'Reset token expired' };
  const passwordHash = await hashPassword(input.password);
  await sql`UPDATE app_users SET password_hash = ${passwordHash}, updated_at = NOW() WHERE id = ${tokenRow.userId}`;
  await sql`UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ${tokenRow.id}`;
  await logAuditEvent({
    eventType: 'password.reset.completed',
    targetUserId: tokenRow.userId,
  });
  return { ok: true };
}

export async function revokeInvite(inviteId: string, actorUserId: string): Promise<void> {
  await ensureNeonSchema();
  await sql`UPDATE user_invites SET revoked_at = NOW() WHERE id = ${inviteId}`;
  await logAuditEvent({
    eventType: 'invite.revoked',
    actorUserId,
    metadata: { inviteId },
  });
}

export async function resendInvite(inviteId: string, actorUserId: string): Promise<{ inviteLink: string }> {
  await ensureNeonSchema();
  const rows = await sql<UserInvite[]>`
    SELECT id, email, name, role, invite_token as "inviteToken", expires_at as "expiresAt",
           used_at as "usedAt", revoked_at as "revokedAt", created_at as "createdAt"
    FROM user_invites
    WHERE id = ${inviteId}
    LIMIT 1
  `;
  const invite = rows[0];
  if (!invite) throw new Error('Invite not found');
  await sql`UPDATE user_invites SET revoked_at = NOW() WHERE id = ${invite.id}`;
  const recreated = await createUserInvite({
    email: invite.email,
    name: invite.name || undefined,
    role: normalizeRole(invite.role),
    invitedByUserId: actorUserId,
  });
  await logAuditEvent({
    eventType: 'invite.resent',
    actorUserId,
    metadata: { fromInviteId: inviteId, toInviteId: recreated.invite.id, email: invite.email },
  });
  const tenantName = process.env.NEXT_PUBLIC_TENANT_NAME || 'RTA Services';
  await sendInviteEmail({ to: invite.email, inviteLink: recreated.inviteLink, tenantName });
  return { inviteLink: recreated.inviteLink };
}

export async function logAuditEvent(input: {
  eventType: string;
  actorUserId?: string | null;
  targetUserId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await ensureNeonSchema();
  await sql`
    INSERT INTO audit_events (event_type, actor_user_id, target_user_id, metadata_json)
    VALUES (${input.eventType}, ${input.actorUserId ?? null}, ${input.targetUserId ?? null}, ${JSON.stringify(input.metadata ?? {})}::jsonb)
  `;
}

export async function listAuditEvents(query: AuditQuery = {}): Promise<AuditEvent[]> {
  await ensureNeonSchema();
  const limit = Math.max(1, Math.min(query.limit ?? 100, 1000));
  const rows = await sql<AuditEvent[]>`
    SELECT id, event_type as "eventType", actor_user_id as "actorUserId", target_user_id as "targetUserId",
           metadata_json as metadata, created_at as "createdAt"
    FROM audit_events
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.filter((row) => {
    if (query.eventType && row.eventType !== query.eventType) return false;
    if (query.actorUserId && row.actorUserId !== query.actorUserId) return false;
    if (query.targetUserId && row.targetUserId !== query.targetUserId) return false;
    if (query.from && new Date(row.createdAt).getTime() < new Date(query.from).getTime()) return false;
    if (query.to && new Date(row.createdAt).getTime() > new Date(query.to).getTime()) return false;
    if (query.q) {
      const hay = `${row.eventType} ${JSON.stringify(row.metadata || {})}`.toLowerCase();
      if (!hay.includes(query.q.toLowerCase())) return false;
    }
    return true;
  });
}

export async function ensureSuperadmin(): Promise<void> {
  await ensureNeonSchema();
  const email = 'admin@rtaservices.net';
  const existing = await getUserByEmail(email);
  const seedPassword = process.env.SUPERADMIN_INITIAL_PASSWORD;
  if (!existing && seedPassword) {
    await createUser({
      email,
      name: 'Administrator',
      password: seedPassword,
      role: 'superadmin',
    });
    return;
  }
  if (existing && existing.role !== 'superadmin') {
    await sql`UPDATE app_users SET role = 'superadmin', updated_at = NOW() WHERE id = ${existing.id}`;
  }
}

export async function listUsers(): Promise<AppUser[]> {
  await ensureNeonSchema();
  const rows = await sql<AppUser[]>`
    SELECT id, name, email, role, is_active as "isActive",
           created_at as "createdAt", updated_at as "updatedAt"
    FROM app_users
    ORDER BY created_at DESC
  `;
  return rows.map((r: AppUser) => ({ ...r, role: normalizeRole(r.role) }));
}

export async function updateUser(
  id: string,
  input: { name?: string; role?: AppRole; isActive?: boolean; password?: string }
): Promise<void> {
  await ensureNeonSchema();
  if (input.name !== undefined) {
    await sql`UPDATE app_users SET name = ${input.name || null}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (input.role !== undefined) {
    await sql`UPDATE app_users SET role = ${normalizeRole(input.role)}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (input.isActive !== undefined) {
    await sql`UPDATE app_users SET is_active = ${input.isActive}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (input.password) {
    const passwordHash = await hashPassword(input.password);
    await sql`UPDATE app_users SET password_hash = ${passwordHash}, updated_at = NOW() WHERE id = ${id}`;
  }
}

export async function deleteUser(id: string): Promise<void> {
  await ensureNeonSchema();
  await sql`DELETE FROM app_users WHERE id = ${id}`;
}
