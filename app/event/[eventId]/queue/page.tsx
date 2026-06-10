'use client';
/* Live queue view for participants */
import Link from 'next/link';
import { useEvent, PhoneHead } from '@/components/participant/EventShell';
import { sel } from '@/components/useEvent';
import { Icon, AvaStack, singerNames } from '@/components/ui';
import type { QueueItem } from '@/lib/types';

export default function QueuePage() {
  const { eventId, state, me } = useEvent();
  const current = sel.current(state);
  const upcoming = sel.upcoming(state);
  const currentSong = current ? sel.songById(state, current.songId) : null;

  function row(item: QueueItem, idx: number) {
    const s = sel.songById(state, item.songId);
    if (!s) return null;
    const mine = item.participantIds.includes(me.id);
    return (
      <div className="song-row" key={item.id} style={mine ? { borderColor: 'var(--gold)' } : undefined}>
        <span style={{ flex: 'none' }}><AvaStack ids={item.participantIds} participants={state.participants} /></span>
        <div className="meta">
          <div className="ttl">{s.title}</div>
          <div className="art">{s.artist}</div>
          <div className="tags">
            <span className="badge badge-soft">{singerNames(state.participants, item.participantIds)}{mine ? ' · you' : ''}</span>
            {item.mode === 'dynamic-duet' && <span className="badge badge-duet">Dynamic duet</span>}
            {item.mode === 'solo-star' && <span className="badge badge-line">Solo star</span>}
          </div>
        </div>
        <span className="up-item" style={{ flex: 'none' }}><span className="n" style={{ fontSize: 20 }}>{idx}</span></span>
      </div>
    );
  }

  return (
    <>
      <PhoneHead title="Home" backHref={`/event/${eventId}`} me={me} />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow">Up next on stage</div>
          <h1 className="h-lg" style={{ margin: '8px 0 16px' }}>The queue</h1>
          {current && currentSong && (
            <div className="now-card accent-gold" style={{ marginBottom: 18 }}>
              <div className="lab">● Now singing</div>
              <div className="t" style={{ fontSize: 20 }}>{currentSong.title}</div>
              <div className="a">{currentSong.artist}</div>
              <div className="singers">
                <AvaStack ids={current.participantIds} participants={state.participants} />
                {' '}{singerNames(state.participants, current.participantIds)}
              </div>
            </div>
          )}
          <div className="sec-title" style={{ marginBottom: 10 }}>Up next · {upcoming.length}</div>
          {upcoming.length === 0
            ? <div className="empty">Queue&apos;s open — be the next star!</div>
            : <div className="song-list">{upcoming.map((it, i) => row(it, i + 1))}</div>}
          <Link className="btn btn-primary" style={{ marginTop: 18 }} href={`/event/${eventId}/themes`}><Icon name="plus" size={18} /> Add a song</Link>
        </div>
      </div>
    </>
  );
}
