'use client';
/* Participant hub */
import Link from 'next/link';
import { useEvent, PhoneHead } from '@/components/participant/EventShell';
import { sel } from '@/components/useEvent';
import { Icon } from '@/components/ui';

export default function HubPage() {
  const { eventId, state, me } = useEvent();
  const upcoming = sel.upcoming(state);
  const current = sel.current(state);
  const mine = sel.activeForParticipant(state, me.id);
  const currentSong = current ? sel.songById(state, current.songId) : null;
  const base = `/event/${eventId}`;

  return (
    <>
      <PhoneHead me={me} />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow">{state.event.name}</div>
          <h1 className="h-xl" style={{ margin: '8px 0 4px' }}>Hi {me.name.split(' ')[0]} 👋</h1>
          <p className="muted" style={{ marginTop: 0, fontSize: 14.5 }}>
            {mine.length === 0 ? 'You have no songs queued yet. Pick one!' : `You have ${mine.length} song${mine.length > 1 ? 's' : ''} lined up.`}
          </p>

          <div className="hub-actions" style={{ marginTop: 22 }}>
            <Link className="hub-card accent-gold" href={`${base}/themes`}>
              <span className="ic"><Icon name="list" /></span>
              <span className="tx"><h3>Browse themes</h3><p>Six curated rooms of party-ready songs</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </Link>
            <Link className="hub-card accent-pink" href={`${base}/random`}>
              <span className="ic"><Icon name="dice" /></span>
              <span className="tx"><h3>Surprise me</h3><p>Solo Star or get matched for a duet</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </Link>
            <Link className="hub-card accent-teal" href={`${base}/queue`}>
              <span className="ic"><Icon name="clock" /></span>
              <span className="tx"><h3>The queue</h3><p>{currentSong ? `Now: ${currentSong.title}` : 'Nothing playing yet'} · {upcoming.length} up next</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
