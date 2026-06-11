import { NextResponse } from 'next/server';
import * as S from '@/lib/state';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { eventId: string } }) {
  const eventId = params.eventId;
  if (!S.getEventState(eventId)) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const { type, ...p } = await req.json();
  try {
    switch (type) {
      case 'join': {
        if (!p.name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });
        return NextResponse.json({ participant: S.join(eventId, p.name) });
      }
      case 'chooseSong':
        return NextResponse.json(S.chooseSong(eventId, p.songId, p.participantIds, p.mode, p.version));
      case 'randomSolo':
        return NextResponse.json({ song: S.randomSolo(eventId) });
      case 'joinDuetPool':
        return NextResponse.json(S.joinDuetPool(eventId, p.participantId));
      case 'leaveDuetPool':
        S.leaveDuetPool(eventId, p.participantId); break;
      case 'startNight': S.startNight(eventId); break;
      case 'startCurrentOrNext': S.startCurrentOrNext(eventId); break;
      case 'playItem': S.playItem(eventId, p.id); break;
      case 'pause': S.pause(eventId); break;
      case 'resume': S.resume(eventId); break;
      case 'markDone': S.markDone(eventId, p.id); break;
      case 'skip': S.skip(eventId, p.id); break;
      case 'removeItem': S.removeItem(eventId, p.id); break;
      case 'moveItem': S.moveItem(eventId, p.id, p.dir); break;
      case 'toggleModeration': S.toggleModeration(eventId); break;
      case 'setEventName': S.setEventName(eventId, p.name); break;
      case 'reset': S.resetEvent(eventId); break;
      default:
        return NextResponse.json({ error: 'Unknown action: ' + type }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('action failed', type, e);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
