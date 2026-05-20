import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { listAuditEvents, listUsers } from '@/lib/users';

export async function GET(request: Request) {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit') || '100');
  const eventType = searchParams.get('eventType') || undefined;
  const actorUserId = searchParams.get('actorUserId') || undefined;
  const targetUserId = searchParams.get('targetUserId') || undefined;
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;
  const q = searchParams.get('q') || undefined;
  const format = (searchParams.get('format') || 'json').toLowerCase();

  const [events, users] = await Promise.all([
    listAuditEvents({ limit, eventType, actorUserId, targetUserId, from, to, q }),
    listUsers(),
  ]);
  const userById = new Map(users.map((u) => [u.id, u]));
  const eventsWithUsers = events.map((e) => ({
    ...e,
    actorName: e.actorUserId ? (userById.get(e.actorUserId)?.name || userById.get(e.actorUserId)?.email || null) : null,
    targetName: e.targetUserId ? (userById.get(e.targetUserId)?.name || userById.get(e.targetUserId)?.email || null) : null,
  }));

  if (format === 'csv') {
    const csvHeader = 'id,eventType,actorUserId,actorName,targetUserId,targetName,createdAt,metadata';
    const lines = eventsWithUsers.map((e) => {
      const esc = (value: string) => `"${String(value).replace(/"/g, '""')}"`;
      return [
        esc(e.id),
        esc(e.eventType),
        esc(e.actorUserId || ''),
        esc(e.actorName || ''),
        esc(e.targetUserId || ''),
        esc(e.targetName || ''),
        esc(e.createdAt),
        esc(JSON.stringify(e.metadata || {})),
      ].join(',');
    });
    const body = [csvHeader, ...lines].join('\n');
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="audit-events.csv"',
      },
    });
  }

  return NextResponse.json({ events: eventsWithUsers });
}
