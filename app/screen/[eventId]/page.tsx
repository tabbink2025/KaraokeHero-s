'use client';
/* Big screen / TV view — large player, slim now-singing strip,
   compact up-next, QR pinned bottom-right. */
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useEventState, useAct, sel } from '@/components/useEvent';
import { Icon, Wordmark, AvaStack, singerNames } from '@/components/ui';

/* ---- YouTube IFrame API loader (once per page) ---- */
declare global {
  interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void }
}
let ytReady: Promise<void> | null = null;
function loadYT(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (!ytReady) {
    ytReady = new Promise<void>((res) => {
      window.onYouTubeIframeAPIReady = () => res();
      const t = document.createElement('script');
      t.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(t);
    });
  }
  return ytReady;
}

/* Player that auto-advances when the current video ends. */
function Stage({ videoId, onEnded }: { videoId: string; onEnded: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const endedRef = useRef<string>('');
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  // create the player once
  useEffect(() => {
    let cancelled = false;
    loadYT().then(() => {
      if (cancelled || !hostRef.current || playerRef.current) return;
      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        host: 'https://www.youtube-nocookie.com',
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, enablejsapi: 1 },
        events: {
          onReady: (e: any) => { try { e.target.playVideo(); } catch {} },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              const vid = playerRef.current?.getVideoData?.()?.video_id || videoId;
              if (endedRef.current === vid) return; // fire once per video
              endedRef.current = vid;
              onEndedRef.current();
            }
          },
        },
      });
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // swap video when the queue advances
  useEffect(() => {
    endedRef.current = '';
    const p = playerRef.current;
    if (p?.loadVideoById && videoId) p.loadVideoById(videoId);
  }, [videoId]);

  return <div ref={hostRef} />;
}

export default function ScreenPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const state = useEventState(eventId);
  const act = useAct(eventId);
  const [joinUrl, setJoinUrl] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setJoinUrl(window.location.origin + '/event/' + eventId);
    setStarted(localStorage.getItem('kh_screen_started_' + eventId) === '1');
  }, [eventId]);

  if (!state) {
    return <div className="tv" style={{ alignItems: 'center', justifyContent: 'center' }}><Wordmark size="lg" /></div>;
  }

  const current = sel.current(state);
  const upcoming = sel.upcoming(state).slice(0, 4);
  const playing = state.playback.isPlaying;
  const song = current ? sel.songById(state, current.songId) : null;
  const videoId = song
    ? (current?.version === 'original' && song.originalVideoId ? song.originalVideoId : song.youtubeVideoId)
    : '';
  const joinUrlShort = joinUrl.replace(/^https?:\/\//, '');

  function start() {
    localStorage.setItem('kh_screen_started_' + eventId, '1');
    setStarted(true);
    act('startCurrentOrNext');
  }

  return (
    <div className="tv">
      <div className="tv-head">
        <Wordmark size="md" />
        <div className="ev">{state.event.name} · Live</div>
      </div>
      <div className="tv-inner">
        {/* stage */}
        <div className="tv-stage">
          <div className="player-frame">
            {started && song
              ? <Stage videoId={videoId} onEnded={() => current && act('markDone', { id: current.id })} />
              : <div className="tv-start">
                  <div style={{ textAlign: 'center', maxWidth: 520, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Wordmark size="lg" /></div>
                    <h1 className="tv-title" style={{ fontSize: 40 }}>{song ? 'Ready when you are' : 'Waiting for the first singer'}</h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: 18, margin: '10px 0 26px', maxWidth: 420, marginInline: 'auto' }}>
                      {song ? 'Browsers block autoplay with sound, so press start to kick off the night.' : 'Add a song from your phone to get things rolling.'}
                    </p>
                    <button className="btn btn-primary" style={{ width: 'auto', padding: '17px 30px', fontSize: 18 }} disabled={!song} onClick={start}>
                      <Icon name="playT" size={20} /> Start karaoke night
                    </button>
                  </div>
                </div>}
          </div>

          {song && current && (
            <div className={'now-bar' + (playing ? '' : ' paused')}>
              <span className="eq"><i /><i /><i /><i /><i /></span>
              <div className="now-main">
                <div className="eyebrow" style={{ color: 'var(--gold)' }}>{playing ? '● Now singing' : 'Up — press start'} · {current.version === 'original' ? 'Origineel' : 'Karaoke'}</div>
                <div className="now-title">{song.title}</div>
                <div className="now-artist">{song.artist}</div>
              </div>
              <div className="tv-singers">
                <AvaStack ids={current.participantIds} participants={state.participants} />
                <span className="names">{singerNames(state.participants, current.participantIds)}</span>
              </div>
            </div>
          )}
        </div>

        {/* side */}
        <div className="tv-side">
          <div className="panel" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <h4>Up next</h4>
            {upcoming.length === 0
              ? <div className="empty">Queue is open — grab the mic!</div>
              : <div className="up-list">
                  {upcoming.map((it, i) => {
                    const s = sel.songById(state, it.songId);
                    if (!s) return null;
                    return (
                      <div className="up-item" key={it.id}>
                        <span className="n">{i + 1}</span>
                        <div className="info">
                          <div className="t">{s.title}</div>
                          <div className="a">{s.artist} · {singerNames(state.participants, it.participantIds)}</div>
                        </div>
                        <span className="who"><AvaStack ids={it.participantIds} participants={state.participants} /></span>
                      </div>
                    );
                  })}
                </div>}
          </div>
          <div className="panel qr-panel">
            <div className="qr-box" style={{ width: 84, height: 84 }}>
              {joinUrl && <QRCodeSVG value={joinUrl} size={70} marginSize={0} fgColor="#18120d" bgColor="#ffffff" />}
            </div>
            <div className="url">
              <div className="lbl">Scan to join</div>
              <div className="u" style={{ fontSize: 13 }}>{joinUrlShort}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
