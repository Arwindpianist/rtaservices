import { cookies } from 'next/headers';
import { isValidUserId } from '@/lib/dashboard-roles';

const COOKIE_NAME = 'rta_dashboard_session';
const GATE_VALUE = 'gate';

export async function isDashboardAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  const value = session?.value ?? '';
  if (value === GATE_VALUE || value === '1') return true;
  return isValidUserId(value);
}
