import { NextResponse } from 'next/server';
import { getXeroTokens } from '@/lib/xero-store';

export async function GET() {
  const tokens = getXeroTokens();
  return NextResponse.json({ connected: !!tokens });
}
