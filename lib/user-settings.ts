import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';

export type TableDensity = 'comfortable' | 'compact';
export type DefaultPeriod = 'this_week' | 'this_month' | 'this_quarter' | 'ytd';

export type UserSettings = {
  userId: string;
  displayName: string | null;
  defaultPeriod: DefaultPeriod;
  tableDensity: TableDensity;
  updatedAt: string;
};

const DEFAULT_SETTINGS: Pick<UserSettings, 'displayName' | 'defaultPeriod' | 'tableDensity'> = {
  displayName: null,
  defaultPeriod: 'ytd',
  tableDensity: 'comfortable',
};

function normalizePeriod(value: string | null | undefined): DefaultPeriod {
  if (value === 'this_week' || value === 'this_month' || value === 'this_quarter') return value;
  return 'ytd';
}

function normalizeDensity(value: string | null | undefined): TableDensity {
  return value === 'compact' ? 'compact' : 'comfortable';
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  await ensureNeonSchema();
  const rows = await sql<UserSettings[]>`
    SELECT user_id as "userId",
           display_name as "displayName",
           default_period as "defaultPeriod",
           table_density as "tableDensity",
           updated_at as "updatedAt"
    FROM user_settings
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  if (!rows[0]) {
    return { userId, ...DEFAULT_SETTINGS, updatedAt: new Date(0).toISOString() };
  }
  return {
    userId: rows[0].userId,
    displayName: rows[0].displayName,
    defaultPeriod: normalizePeriod(rows[0].defaultPeriod),
    tableDensity: normalizeDensity(rows[0].tableDensity),
    updatedAt: rows[0].updatedAt,
  };
}

export async function upsertUserSettings(
  userId: string,
  input: Partial<Pick<UserSettings, 'displayName' | 'defaultPeriod' | 'tableDensity'>>,
): Promise<UserSettings> {
  await ensureNeonSchema();
  const current = await getUserSettings(userId);
  const displayName = input.displayName === undefined ? current.displayName : input.displayName;
  const defaultPeriod = normalizePeriod(input.defaultPeriod ?? current.defaultPeriod);
  const tableDensity = normalizeDensity(input.tableDensity ?? current.tableDensity);

  const rows = await sql<UserSettings[]>`
    INSERT INTO user_settings (user_id, display_name, default_period, table_density, updated_at)
    VALUES (${userId}, ${displayName}, ${defaultPeriod}, ${tableDensity}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      default_period = EXCLUDED.default_period,
      table_density = EXCLUDED.table_density,
      updated_at = NOW()
    RETURNING user_id as "userId",
              display_name as "displayName",
              default_period as "defaultPeriod",
              table_density as "tableDensity",
              updated_at as "updatedAt"
  `;
  return {
    userId: rows[0].userId,
    displayName: rows[0].displayName,
    defaultPeriod: normalizePeriod(rows[0].defaultPeriod),
    tableDensity: normalizeDensity(rows[0].tableDensity),
    updatedAt: rows[0].updatedAt,
  };
}

