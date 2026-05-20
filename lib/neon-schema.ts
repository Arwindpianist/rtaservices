import { sql } from '@/lib/db';

let initialized = false;

export async function ensureNeonSchema(): Promise<void> {
  if (initialized) return;

  await sql`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS app_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      email_verified TIMESTAMPTZ,
      image TEXT,
      role TEXT NOT NULL DEFAULT 'staff',
      password_hash TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS accounts (
      user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      PRIMARY KEY (provider, provider_account_id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      session_token TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      expires TIMESTAMPTZ NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      PRIMARY KEY (identifier, token)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cache_entries (
      cache_key TEXT PRIMARY KEY,
      scope TEXT NOT NULL DEFAULT 'global',
      payload_json JSONB NOT NULL,
      etag TEXT,
      expires_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pipeline_drafts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      zoho_quote_id TEXT NOT NULL,
      author_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
      payload_json JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      source_modified_time TEXT,
      committed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_pipeline_drafts_quote ON pipeline_drafts(zoho_quote_id);
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pipeline_draft_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      draft_id UUID NOT NULL REFERENCES pipeline_drafts(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      before_json JSONB,
      after_json JSONB,
      actor_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS integration_links (
      zoho_quote_id TEXT PRIMARY KEY,
      xero_invoice_id TEXT NOT NULL,
      xero_invoice_number TEXT,
      status TEXT,
      paid_at TEXT,
      created_at TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS xero_tokens (
      id TEXT PRIMARY KEY DEFAULT 'default',
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      expires_at BIGINT NOT NULL,
      tenant_id TEXT,
      authorized_by_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
      authorized_by_role TEXT,
      authorized_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    ALTER TABLE xero_tokens
    ADD COLUMN IF NOT EXISTS authorized_by_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL;
  `;
  await sql`
    ALTER TABLE xero_tokens
    ADD COLUMN IF NOT EXISTS authorized_by_role TEXT;
  `;
  await sql`
    ALTER TABLE xero_tokens
    ADD COLUMN IF NOT EXISTS authorized_at TIMESTAMPTZ;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cache_invalidation_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      prefix TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_invites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'staff',
      invite_token TEXT NOT NULL UNIQUE,
      invited_by_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      revoked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_user_invites_email ON user_invites(lower(email));
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      reset_token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_by_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    ALTER TABLE user_invites
    ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS audit_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type TEXT NOT NULL,
      actor_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
      target_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
      metadata_json JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS access_modules (
      module_key TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      description TEXT,
      is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS role_module_permissions (
      role TEXT NOT NULL,
      module_key TEXT NOT NULL REFERENCES access_modules(module_key) ON DELETE CASCADE,
      permission_level TEXT NOT NULL DEFAULT 'none',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (role, module_key)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_module_overrides (
      user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      module_key TEXT NOT NULL REFERENCES access_modules(module_key) ON DELETE CASCADE,
      permission_level TEXT NOT NULL DEFAULT 'none',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, module_key)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tenant_module_toggles (
      module_key TEXT PRIMARY KEY REFERENCES access_modules(module_key) ON DELETE CASCADE,
      is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_role_module_permissions_role ON role_module_permissions(role);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_user_module_overrides_user ON user_module_overrides(user_id);
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id UUID PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
      display_name TEXT,
      default_period TEXT NOT NULL DEFAULT 'ytd',
      table_density TEXT NOT NULL DEFAULT 'comfortable',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS private_support_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      requester_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
      requester_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_private_support_requests_status ON private_support_requests(status, created_at DESC);
  `;

  initialized = true;
}
