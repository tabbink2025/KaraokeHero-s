'use client';
/* Participant shell: live state, identity (name gate), toast, duet sheet.
   Wraps every /event/[eventId] page. */
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEventState, useAct, useMe, sel } from '@/components/useEvent';
import { Icon, Wordmark, Avatar, partName } from '@/components/ui';
import type { EventState, Participant, Song, SongVersion } from '@/lib/types';

interface ToastData { error?: boolean; body: ReactNode }

interface EventCtxValue {
  eventId: string;
  state: EventState;
  me: Participant;
  act: (type: string, payload?: Record<string, unknown>) => Promise<any>;
  toast: (t: ToastData) => void;
  chooseSong: (song: Song, version?: SongVersion) => void;
}

/* Karaoke / Original segmented toggle, shared by song rows and the duet sheet. */
export function VersionToggle({ value, onChange, song }: { value: SongVersion; onChange: (v: SongVersion) => void; song: Song }) {
  const hasOriginal = !!song.originalVideoId;
  return (
    <div className="ver-toggle" role="group" aria-label="Song version">
      <button type="button" className={'ver-opt' + (value === 'karaoke' ? ' on' : '')}
        onClick={() => onChange('karaoke')}>Karaoke</button>
      <button type="button" className={'ver-opt' + (value === 'original' ? ' on' : '')}
        disabled={!hasOriginal} title={hasOriginal ? '' : 'No original available'}
        onClick={() => onChange('original')}>Origineel</button>
    </div>
  );
}

const EventCtx = createContext<EventCtxValue | null>(null);
export function useEvent(): EventCtxValue {
  const v = useContext(EventCtx);
  if (!v) throw new Error('useEvent outside EventShell');
  return v;
}

export function PhoneHead({ title, backHref, me }: { title?: string; backHref?: string; me: Participant }) {
  const router = useRouter();
  return (
    <div className="p-head">
      {backHref
        ? <button className="p-back" onClick={() => router.push(backHref)}><Icon name="chevL" size={18} />{title || 'Back'}</button>
        : <Wordmark size="sm" />}
      <span className="p-me"><Avatar id={me.id} name={me.name} />{me.name}</span>
    </div>
  );
}

function Toast({ data, onDone }: { data: ToastData | null; onDone: () => void }) {
  useEffect(() => {
    if (!data) return;
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [data, onDone]);
  if (!data) return null;
  return (
    <div className="toast">
      <span className="ic"><Icon name={data.error ? 'clock' : 'check'} size={18} /></span>
      <span className="tx">{data.body}</span>
    </div>
  );
}

function DuetSheet({ song, onClose }: { song: Song; onClose: () => void }) {
  const { state, me, act, toast } = useEvent();
  const router = useRouter();
  const [version, setVersion] = useState<SongVersion>('karaoke');

  async function havePartner() {
    const r = await act('chooseSong', { songId: song.id, participantIds: [me.id], mode: 'theme-choice', version });
    onClose();
    toast(r.ok
      ? { body: <span><b>{song.title}</b> queued — grab your partner!</span> }
      : { error: true, body: r.message });
  }
  async function randomPartner() {
    const others = state.participants.filter((p) => p.id !== me.id && p.name);
    const partner = others[Math.floor(Math.random() * others.length)];
    const ids = partner ? [me.id, partner.id] : [me.id];
    const r = await act('chooseSong', { songId: song.id, participantIds: ids, mode: 'theme-choice', version });
    onClose();
    toast(r.ok
      ? { body: <span>Matched with <b>{partner ? partner.name : 'a partner'}</b> for {song.title}!</span> }
      : { error: true, body: r.message });
  }
  function pool() {
    onClose();
    router.push(`/event/${state.event.id}/random/duet`);
  }

  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet accent-violet" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />
        <div style={{ marginBottom: 6 }}><span className="badge badge-duet">Duet</span></div>
        <h2 className="h-lg" style={{ margin: '4px 0 2px' }}>{song.title}</h2>
        <p className="muted" style={{ margin: '0 0 14px', fontSize: 13.5 }}>{song.artist} · How do you want a partner?</p>
        <div style={{ marginBottom: 16 }}><VersionToggle value={version} onChange={setVersion} song={song} /></div>
        <button className="opt-row" onClick={havePartner}>
          <span className="ic"><Icon name="users" size={20} /></span>
          <span className="tx"><h4>I already have a partner</h4><p>You&apos;ll sing together — bring them to the stage</p></span>
        </button>
        <button className="opt-row" onClick={randomPartner}>
          <span className="ic"><Icon name="shuffle" size={20} /></span>
          <span className="tx"><h4>Find me a random partner</h4><p>We&apos;ll pair you with another guest right now</p></span>
        </button>
        <button className="opt-row" onClick={pool}>
          <span className="ic"><Icon name="duo" size={20} /></span>
          <span className="tx"><h4>Put me in the duet pool</h4><p>Wait to be matched via Dynamic Duets</p></span>
        </button>
      </div>
    </div>
  );
}

function NameScreen({ eventName, onJoin }: { eventName: string; onJoin: (n: string) => void }) {
  const [v, setV] = useState('');
  return (
    <div className="p-scroll">
      <div className="p-topgap" />
      <div className="p-pad" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 44px)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Wordmark size="lg" /></div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{eventName}</div>
          <h1 className="h-xl" style={{ marginBottom: 8 }}>Grab the mic.</h1>
          <p className="muted" style={{ margin: '0 auto', maxWidth: 260, fontSize: 14.5, lineHeight: 1.45 }}>
            Pick your songs, hop in the queue, and own the room. First — what should we call you on the big screen?
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            autoFocus value={v} onChange={(e) => setV(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && v.trim()) onJoin(v); }}
            placeholder="Your name"
            style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '16px 18px', color: 'var(--text)', fontSize: 16, fontWeight: 600, textAlign: 'center' }}
          />
          <button className="btn btn-primary" disabled={!v.trim()} onClick={() => onJoin(v)}>
            <Icon name="mic" size={18} /> Let&apos;s sing
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventShell({ eventId, children }: { eventId: string; children: ReactNode }) {
  const state = useEventState(eventId);
  const act = useAct(eventId);
  const { me, ready, join } = useMe(eventId, state);
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [duetSong, setDuetSong] = useState<Song | null>(null);

  if (!state || !ready) {
    return <div className="stage"><div className="p-app" style={{ alignItems: 'center', justifyContent: 'center' }}><Wordmark size="lg" /></div></div>;
  }

  if (!me) {
    return (
      <div className="stage">
        <div className="p-app"><NameScreen eventName={state.event.name} onJoin={join} /></div>
      </div>
    );
  }

  const toast = (t: ToastData) => setToastData(t);
  const chooseSong = async (song: Song, version: SongVersion = 'karaoke') => {
    if (song.type === 'duet') { setDuetSong(song); return; }
    const r = await act('chooseSong', { songId: song.id, participantIds: [me.id], mode: 'theme-choice', version });
    toast(r.ok
      ? { body: <span><b>{song.title}</b> added — you&apos;re #{r.position} up next</span> }
      : { error: true, body: r.message });
  };

  return (
    <EventCtx.Provider value={{ eventId, state, me, act, toast, chooseSong }}>
      <div className="stage">
        <div className="p-app">
          {children}
          {duetSong && <DuetSheet song={duetSong} onClose={() => setDuetSong(null)} />}
          <Toast data={toastData} onDone={() => setToastData(null)} />
        </div>
      </div>
    </EventCtx.Provider>
  );
}

export { sel, partName };
