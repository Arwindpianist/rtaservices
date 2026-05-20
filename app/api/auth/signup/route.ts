import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Direct signup disabled. Use invite link from administrator.' },
    { status: 403 }
  );
}
