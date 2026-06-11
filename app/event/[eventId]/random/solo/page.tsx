'use client';
/* Solo Star — random solo pick with confirm */
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEvent, PhoneHead, VersionToggle } from '@/components/participant/EventShell';
import { Icon, Diff, LangBadge } from '@/components/ui';
import type { Song, SongVersion } from '@/lib/types';

export default function SoloStarPage() {
  const { eventId, me, act, toast } = useEvent();
  const router = useRouter();
  const [song, setSong] = useState<Song | null>(null);
  const [spinning, setSpinning] = useState(true);
  const [version, setVersion] = useState<SongVersion>('karaoke');

  const reroll = useCallback(async () => {
    setSpinning(true);
    const r = await act('randomSolo');
    setSong(r.song);
    setTimeout(() => setSpinning(false), 900);
  }, [act]);

  useEffect(() => { reroll(); }, [reroll]);

  async function confirm() {
    if (!song) return;
    const r = await act('chooseSong', { songId: song.id, participantIds: [me.id], mode: 'solo-star', version });
    if (r.ok) {
      toast({ body: <span><b>{song.title}</b> added — you&apos;re #{r.position} up next</span> });
      router.push(`/event/${eventId}/queue`);
    } else {
      toast({ error: true, body: r.message });
    }
  }

  return (
    <>
      <PhoneHead title="Surprise me" backHref={`/event/${eventId}/random`} me={me} />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow" style={{ textAlign: 'center' }}>Solo Star</div>
          <p className="muted" style={{ textAlign: 'center', margin: '8px 0 20px', fontSize: 14 }}>Your random solo pick</p>
          <div className="confirm-card">
            <div className={'spin' + (spinning ? ' spinning' : '')}><span><Icon name={spinning ? 'shuffle' : 'star'} size={22} /></span></div>
            <div style={{ minHeight: 70 }}>
              {spinning || !song
                ? <div className="h-lg" style={{ color: 'var(--text-mut)' }}>Shuffling…</div>
                : <>
                    <div className="h-lg" style={{ marginBottom: 4 }}>{song.title}</div>
                    <div className="muted" style={{ fontSize: 14 }}>{song.artist}</div>
                    <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 12 }}>
                      <Diff d={song.difficulty} /><LangBadge lang={song.language} />
                    </div>
                  </>}
            </div>
          </div>
          {!spinning && song && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <VersionToggle value={version} song={song} onChange={setVersion} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary" disabled={spinning} onClick={confirm}><Icon name="plus" size={18} /> Add to queue</button>
            <button className="btn btn-outline" disabled={spinning} onClick={reroll}><Icon name="shuffle" size={18} /> Try another</button>
          </div>
        </div>
      </div>
    </>
  );
}
