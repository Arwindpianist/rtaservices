import { NextResponse } from 'next/server';

// Legacy endpoint retained temporarily for compatibility.
// Authentication is now handled by NextAuth routes under /api/auth.
export async function GET() {
  return NextResponse.json({ error: 'Legacy endpoint removed. Use /api/auth/session.' }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: 'Legacy endpoint removed. Use /api/auth/signin.' }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
