import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';

export type PipelineDraft = {
  id: string;
  zohoQuoteId: string;
  authorUserId: string | null;
  payload: Record<string, unknown>;
  status: string;
  sourceModifiedTime: string | null;
  committedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listPipelineDrafts(): Promise<PipelineDraft[]> {
  await ensureNeonSchema();
  return sql<PipelineDraft[]>`
    SELECT id, zoho_quote_id as "zohoQuoteId", author_user_id as "authorUserId",
           payload_json as payload, status, source_modified_time as "sourceModifiedTime",
           committed_at as "committedAt", created_at as "createdAt", updated_at as "updatedAt"
    FROM pipeline_drafts
    ORDER BY updated_at DESC
  `;
}

export async function createPipelineDraft(input: {
  zohoQuoteId: string;
  authorUserId: string;
  payload: Record<string, unknown>;
  sourceModifiedTime?: string;
}): Promise<PipelineDraft> {
  await ensureNeonSchema();
  const rows = await sql<PipelineDraft[]>`
    INSERT INTO pipeline_drafts (zoho_quote_id, author_user_id, payload_json, status, source_modified_time)
    VALUES (${input.zohoQuoteId}, ${input.authorUserId}, ${JSON.stringify(input.payload)}::jsonb, 'draft', ${input.sourceModifiedTime ?? null})
    RETURNING id, zoho_quote_id as "zohoQuoteId", author_user_id as "authorUserId",
              payload_json as payload, status, source_modified_time as "sourceModifiedTime",
              committed_at as "committedAt", created_at as "createdAt", updated_at as "updatedAt"
  `;
  return rows[0];
}

export async function updatePipelineDraft(id: string, patch: {
  payload?: Record<string, unknown>;
  status?: string;
}): Promise<void> {
  await ensureNeonSchema();
  if (patch.payload) {
    await sql`
      UPDATE pipeline_drafts
      SET payload_json = ${JSON.stringify(patch.payload)}::jsonb, updated_at = NOW()
      WHERE id = ${id}
    `;
  }
  if (patch.status) {
    await sql`
      UPDATE pipeline_drafts
      SET status = ${patch.status}, updated_at = NOW()
      WHERE id = ${id}
    `;
  }
}

export async function deletePipelineDraft(id: string): Promise<void> {
  await ensureNeonSchema();
  await sql`DELETE FROM pipeline_drafts WHERE id = ${id}`;
}

export async function markDraftCommitted(id: string): Promise<void> {
  await ensureNeonSchema();
  await sql`
    UPDATE pipeline_drafts
    SET status = 'committed', committed_at = NOW(), updated_at = NOW()
    WHERE id = ${id}
  `;
}
