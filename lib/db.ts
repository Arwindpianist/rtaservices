import postgres from 'postgres';

declare global {
  // eslint-disable-next-line no-var
  var __rta_sql__: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }
  return postgres(url, {
    ssl: 'require',
    max: 10,
    idle_timeout: 20,
  });
}

export const sql = global.__rta_sql__ ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  global.__rta_sql__ = sql;
}
