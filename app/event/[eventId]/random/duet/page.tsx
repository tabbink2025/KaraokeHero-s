'use client';
/* Dynamic Duets — join the pool, get matched live with another guest */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEvent, PhoneHead } from '@/components/participant/EventShell';
import { sel } from '@/components/useEvent';
import { Icon, Avatar, partName } from '@/components/ui';
import type { QueueItem } from '@/lib/types';

export default function DynamicDuetPage() {
  const { eventId, state, me, act } = useEvent();
  const router = useRouter();
  const joinedAtRef = useRef(Date.now());
  const matchedRef = useRef(false);
  const [joined, setJoined] = useState(false);

  // My freshest dynamic-duet match since joining this page.
  const match: QueueItem | undefined = state.queue
    .filter((q) => q.mode === 'dynamic-duet' && q.participantIds.includes(me.id) && q.createdAt >= joinedAtRef.current - 2000)
    .sort((a, b) => b.createdAt - a.createdAt)[0];

  useEffect(() => {
    if (match) matchedRef.current = true;
  }, [match]);

  useEffect(() => {
    joinedAtRef.current = Date.now();
    act('joinDuetPool', { participantId: me.id }).then((r) => {
      if (r.matched) matchedRef.current = true;
      setJoined(true);
    });
    return () => {
      if (!matchedRef.current) act('leaveDuetPool', { participantId: me.id });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const partnerId = match ? match.participantIds.find((id) => id !== me.id) : null;
  const song = match ? sel.songById(state, match.songId) : null;

  return (
    <>
      <PhoneHead title="Surprise me" backHref={`/event/${eventId}/random`} me={me} />
      <div className="p-scroll">
        <div className="p-pad accent-violet" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Dynamic Duets</div>
          {!match ? (
            <>
              <h1 className="h-lg" style={{ margin: '10px 0 4px' }}>Finding your duet partner…</h1>
              <p className="muted" style={{ fontSize: 14 }}>You&apos;re in the pool. Hang tight — we&apos;ll pair you with the next available singer.</p>
              <div className="pulse-ring" style={{ marginTop: 30 }}><span className="core"><Icon name="duo" size={26} /></span></div>
              {joined && <div className="pool-chip" style={{ marginTop: 20 }}><span className="dot" style={{ background: 'currentColor' }} /> In the duet pool</div>}
              <button className="btn btn-outline" style={{ marginTop: 28 }} onClick={() => router.push(`/event/${eventId}/random`)}>Leave the pool</button>
            </>
          ) : (
            <>
              <div style={{ width: 64, height: 64, margin: '20px auto 16px', borderRadius: '50%', background: 'conic-gradient(from 0deg, var(--violet), var(--pink), var(--cyan), var(--violet))', display: 'grid', placeItems: 'center' }}>
                <span style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--violet)' }}><Icon name="check" size={24} /></span>
              </div>
              <h1 className="h-lg" style={{ marginBottom: 6 }}>It&apos;s a match!</h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '12px 0' }}>
                <Avatar id={me.id} name={me.name} />
                <span className="muted" style={{ fontWeight: 700 }}>+</span>
                {partnerId && <Avatar id={partnerId} name={partName(state.participants, partnerId)} />}
                <span style={{ fontWeight: 700, fontSize: 15 }}>You & {partnerId ? partName(state.participants, partnerId) : '???'}</span>
              </div>
              {song && (
                <div className="confirm-card" style={{ marginTop: 8 }}>
                  <span className="badge badge-duet" style={{ marginBottom: 8 }}>Your duet</span>
                  <div className="h-lg" style={{ marginBottom: 4 }}>{song.title}</div>
                  <div className="muted" style={{ fontSize: 14 }}>{song.artist}</div>
                </div>
              )}
              <p className="muted" style={{ fontSize: 13, marginTop: 14 }}>Added to the queue automatically.</p>
              <Link className="btn btn-primary" style={{ marginTop: 12 }} href={`/event/${eventId}/queue`}><Icon name="clock" size={18} /> See the queue</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
