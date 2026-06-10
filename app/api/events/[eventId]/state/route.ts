import { NextResponse } from 'next/server';
import { getEventState } from '@/lib/state';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { eventId: string } }) {
  const state = getEventState(params.eventId);
  if (!state) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  return NextResponse.json(state);
}
