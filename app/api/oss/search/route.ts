import { NextRequest, NextResponse } from 'next/server';
import { recognizeOss } from '@/lib/oss/oss-recognition';
import { routeOssAnswer } from '@/lib/oss/oss-routing';

interface SearchBody {
  input?: string;
  supportContext?: string;
}

export async function POST(request: NextRequest) {
  let body: SearchBody;
  try {
    body = (await request.json()) as SearchBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const input = (body.input ?? '').trim();
  const supportContext = (body.supportContext ?? '').trim();

  if (!input) {
    return NextResponse.json({ error: 'Input is required' }, { status: 400 });
  }

  if (input.length > 500) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }

  const recognition = recognizeOss(input);
  const answer = routeOssAnswer(recognition, input, supportContext);

  return NextResponse.json({
    title: answer.title,
    paragraph: answer.paragraph,
    bullets: answer.bullets,
    ctaLabel: answer.ctaLabel,
    mode: answer.mode,
    familyCount: answer.familyCount,
    families: answer.families,
    recognizedNames: recognition.recognized.map((r) => r.name),
    unrecognized: recognition.unrecognized,
  });
}
