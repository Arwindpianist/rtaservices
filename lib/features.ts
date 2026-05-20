import { isAuthenticatedRoutesDisabled } from '@/lib/authenticated-routes';

export const features = {
  neonPersistence: process.env.NEON_PERSISTENCE_ENABLED !== 'false',
  dashboardCache: process.env.NEON_CACHE_ENABLED !== 'false',
  pipelineDrafts: process.env.NEON_DRAFTS_ENABLED !== 'false',
  /** When true, dashboard/auth pages and protected APIs are shut down; public site remains live. */
  authenticatedRoutesDisabled: isAuthenticatedRoutesDisabled(),
};
