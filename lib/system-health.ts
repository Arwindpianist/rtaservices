import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';
import { getXeroTokensAsync } from '@/lib/xero-store';
import { ensureModuleAccessSeed } from '@/lib/module-access';

export type ServiceHealth = {
  key: string;
  label: string;
  status: 'up' | 'degraded' | 'down';
  detail: string;
};

export async function getSystemHealth(): Promise<ServiceHealth[]> {
  const health: ServiceHealth[] = [];

  // Neon/DB availability
  try {
    await ensureNeonSchema();
    await sql`SELECT 1`;
    health.push({
      key: 'neon-db',
      label: 'Neon Database',
      status: 'up',
      detail: 'Connected and schema reachable.',
    });
  } catch {
    health.push({
      key: 'neon-db',
      label: 'Neon Database',
      status: 'down',
      detail: 'Database unavailable or schema init failed.',
    });
  }

  // Module access policy layer availability
  try {
    await ensureModuleAccessSeed();
    health.push({
      key: 'module-access',
      label: 'Module Access Policies',
      status: 'up',
      detail: 'Policy catalog and defaults loaded.',
    });
  } catch {
    health.push({
      key: 'module-access',
      label: 'Module Access Policies',
      status: 'down',
      detail: 'Failed to load policy seed/state.',
    });
  }

  // Xero connection/token health
  try {
    const tokens = await getXeroTokensAsync();
    if (!tokens?.access_token || !tokens?.tenant_id) {
      health.push({
        key: 'xero',
        label: 'Xero Integration',
        status: 'down',
        detail: 'No active tenant token stored.',
      });
    } else if (Date.now() >= Number(tokens.expires_at)) {
      health.push({
        key: 'xero',
        label: 'Xero Integration',
        status: 'degraded',
        detail: 'Stored token expired; refresh required.',
      });
    } else {
      health.push({
        key: 'xero',
        label: 'Xero Integration',
        status: 'up',
        detail: 'Tenant token available and not expired.',
      });
    }
  } catch {
    health.push({
      key: 'xero',
      label: 'Xero Integration',
      status: 'degraded',
      detail: 'Could not read Xero token state.',
    });
  }

  // Zoho configuration readiness
  const zohoConfigured =
    Boolean(process.env.ZOHO_CLIENT_ID) &&
    Boolean(process.env.ZOHO_CLIENT_SECRET) &&
    Boolean(process.env.ZOHO_REFRESH_TOKEN);
  health.push({
    key: 'zoho-config',
    label: 'Zoho Configuration',
    status: zohoConfigured ? 'up' : 'degraded',
    detail: zohoConfigured ? 'OAuth environment variables present.' : 'Missing one or more Zoho env vars.',
  });

  return health;
}

export function getOverallHealthStatus(services: ServiceHealth[]): 'up' | 'degraded' | 'down' {
  if (services.some((s) => s.status === 'down')) return 'down';
  if (services.some((s) => s.status === 'degraded')) return 'degraded';
  return 'up';
}

