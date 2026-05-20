import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';

export type SupportRequestStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type PrivateSupportRequest = {
  id: string;
  requesterUserId: string | null;
  requesterEmail: string;
  subject: string;
  message: string;
  status: SupportRequestStatus;
  createdAt: string;
  updatedAt: string;
};

function normalizeStatus(value: string): SupportRequestStatus {
  if (value === 'in_progress' || value === 'resolved' || value === 'closed') return value;
  return 'open';
}

export async function createPrivateSupportRequest(input: {
  requesterUserId: string;
  requesterEmail: string;
  subject: string;
  message: string;
}): Promise<PrivateSupportRequest> {
  await ensureNeonSchema();
  const rows = await sql<PrivateSupportRequest[]>`
    INSERT INTO private_support_requests (requester_user_id, requester_email, subject, message, status, updated_at)
    VALUES (${input.requesterUserId}, ${input.requesterEmail}, ${input.subject}, ${input.message}, 'open', NOW())
    RETURNING id,
              requester_user_id as "requesterUserId",
              requester_email as "requesterEmail",
              subject,
              message,
              status,
              created_at as "createdAt",
              updated_at as "updatedAt"
  `;
  return { ...rows[0], status: normalizeStatus(rows[0].status) };
}

export async function listPrivateSupportRequests(status?: string): Promise<PrivateSupportRequest[]> {
  await ensureNeonSchema();
  const rows = await sql<PrivateSupportRequest[]>`
    SELECT id,
           requester_user_id as "requesterUserId",
           requester_email as "requesterEmail",
           subject,
           message,
           status,
           created_at as "createdAt",
           updated_at as "updatedAt"
    FROM private_support_requests
    ORDER BY created_at DESC
    LIMIT 500
  `;
  return rows
    .map((row) => ({ ...row, status: normalizeStatus(row.status) }))
    .filter((row) => (status ? row.status === normalizeStatus(status) : true));
}

export async function updatePrivateSupportRequestStatus(id: string, status: SupportRequestStatus): Promise<void> {
  await ensureNeonSchema();
  await sql`
    UPDATE private_support_requests
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

