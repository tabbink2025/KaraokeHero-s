'use client';
/* Admin — queue management console */
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useEventState, useAct, sel } from '@/components/useEvent';
import { Icon, Wordmark, Avatar, AvaStack, TypeBadge, singerNames, partName } from '@/components/ui';
import type { EventState } from '@/lib/types';

function EventNameEditor({ state, act }: { state: EventState; act: ReturnType<typeof useAct> }) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(state.event.name);
  function commit() { act('setEventName', { name: v }); setEditing(false); }
  if (editing) {
    return (
      <input autoFocus value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setV(state.event.name); setEditing(false); } }}
        style={{ background: 'var(--surface)', border: '1px solid var(--gold)', borderRadius: 8, padding: '5px 10px', color: 'var(--text)', fontSize: 12.5, fontWeight: 700, width: 168 }} />
    );
  }
  return (
    <button onClick={() => { setV(state.event.name); setEditing(true); }} title="Rename event"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 0, color: 'var(--text-dim)', fontSize: 12.5, fontWeight: 700 }}>
      {state.event.name}<span style={{ color: 'var(--text-mut)' }}><Icon name="pencil" size={13} /></span>
    </button>
  );
}

export default function AdminPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const state = useEventState(eventId);
  const act = useAct(eventId);

  if (!state) {
    return <div className="stage" style={{ alignItems: 'center', justifyContent: 'center' }}><Wordmark size="lg" /></div>;
  }

  const current = sel.current(state);
  const upcoming = sel.upcoming(state);
  const playing = state.playback.isPlaying;
  const curSong = current ? sel.songById(state, current.songId) : null;
  const namedGuests = state.participants.filter((p) => p.name);

  return (
    <div className="admin">
      {/* main */}
      <div className="admin-main scrollable">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Wordmark size="sm" />
            <span className="badge badge-soft">Admin</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="muted" style={{ fontSize: 12.5 }}>Event:</span>
            <EventNameEditor state={state} act={act} />
          </span>
        </div>

        {/* now playing */}
        <p className="sec-title"><Icon name="playT" size={13} /> Current song</p>
        {current && curSong ? (
          <div className="now-card">
            <div className="row1">
              <AvaStack ids={current.participantIds} participants={state.participants} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="lab">{playing ? '● On stage now' : 'Loaded — not started'}</div>
                <div className="t">{curSong.title}</div>
                <div className="a">{curSong.artist}</div>
                <div className="singers"><Icon name="mic" size={15} /> {singerNames(state.participants, current.participantIds)} · <TypeBadge type={curSong.type} /></div>
              </div>
            </div>
            <div className="controls">
              {playing
                ? <button className="ctrl warn" onClick={() => act('pause')}><Icon name="pause" size={16} /> Pause</button>
                : <button className="ctrl primary" onClick={() => act('resume')}><Icon name="playT" size={16} /> Start current song</button>}
              <button className="ctrl" onClick={() => act('skip', { id: current.id })}><Icon name="skip" size={16} /> Skip</button>
              <button className="ctrl done" onClick={() => act('markDone', { id: current.id })}><Icon name="check" size={16} /> Mark as done</button>
            </div>
          </div>
        ) : (
          <div className="now-card" style={{ textAlign: 'center' }}>
            <p className="muted" style={{ margin: '4px 0 14px' }}>Nothing playing.</p>
            <button className="ctrl primary" disabled={upcoming.length === 0} onClick={() => upcoming[0] && act('playItem', { id: upcoming[0].id })} style={{ margin: '0 auto' }}>
              <Icon name="playT" size={16} /> Start next song
            </button>
          </div>
        )}

        {/* queue */}
        <p className="sec-title" style={{ marginTop: 24 }}><Icon name="list" size={13} /> Queue · {upcoming.length}</p>
        {upcoming.length === 0
          ? <div className="empty">No songs queued. Guests can add from their phones.</div>
          : upcoming.map((it, i) => {
            const s = sel.songById(state, it.songId);
            if (!s) return null;
            return (
              <div className="q-item" key={it.id}>
                <span className="pos">{i + 1}</span>
                <span style={{ flex: 'none' }}><AvaStack ids={it.participantIds} participants={state.participants} /></span>
                <div className="info">
                  <div className="t">{s.title}</div>
                  <div className="sub">
                    {singerNames(state.participants, it.participantIds)}
                    {it.mode === 'dynamic-duet' && <span className="badge badge-duet">Dyn. duet</span>}
                    {it.mode === 'solo-star' && <span className="badge badge-line">Solo star</span>}
                    <span className="diff" data-d={s.difficulty}><span className="bars"><i /><i /><i /></span></span>
                  </div>
                </div>
                <div className="moves">
                  <button disabled={i === 0} onClick={() => act('moveItem', { id: it.id, dir: -1 })}><Icon name="chevU" size={13} /></button>
                  <button disabled={i === upcoming.length - 1} onClick={() => act('moveItem', { id: it.id, dir: 1 })}><Icon name="chevD" size={13} /></button>
                </div>
                <div className="actions">
                  <button className="iconbtn" title="Play now" onClick={() => act('playItem', { id: it.id })}><Icon name="playT" size={15} /></button>
                  <button className="iconbtn danger" title="Remove" onClick={() => act('removeItem', { id: it.id })}><Icon name="trash" size={15} /></button>
                </div>
              </div>
            );
          })}
      </div>

      {/* side */}
      <div className="admin-side scrollable">
        <p className="sec-title"><Icon name="shield" size={13} /> Moderation</p>
        <div className="card-soft" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Approve before queue</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{state.moderation ? 'On — you keep control of the list' : 'Off — songs go straight in'}</div>
          </div>
          <button className={'toggle' + (state.moderation ? ' on' : '')} onClick={() => act('toggleModeration')}>
            <span className="track"><span className="knob" /></span>
          </button>
        </div>

        <div className="divider" />
        <p className="sec-title"><Icon name="duo" size={13} /> Duet pool · {state.duetPool.length}</p>
        {state.duetPool.length === 0
          ? <div className="empty" style={{ padding: '16px 12px' }}>Pool is empty</div>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {state.duetPool.map((e) => (
                <span className="pool-chip" key={e.id}>
                  <Avatar id={e.participantId} name={partName(state.participants, e.participantId)} />
                  {' '}{partName(state.participants, e.participantId)}
                </span>
              ))}
            </div>}

        <div className="divider" />
        <p className="sec-title"><Icon name="users" size={13} /> Guests · {namedGuests.length}</p>
        <div className="plist">
          {namedGuests.map((p) => {
            const n = sel.activeForParticipant(state, p.id).length;
            return (
              <div className="prow" key={p.id}>
                <Avatar id={p.id} name={p.name} />
                <span className="nm">{p.name}</span>
                <span className="ct">{n} queued</span>
              </div>
            );
          })}
        </div>

        <div className="divider" />
        <button className="btn btn-outline btn-sm" style={{ width: '100%' }}
          onClick={() => {
            if (!confirm('Reset this event? This removes all guests, the queue, and the duet pool.')) return;
            localStorage.removeItem('kh_screen_started_' + eventId);
            act('reset');
          }}>
          <Icon name="shuffle" size={15} /> Reset event data
        </button>
      </div>
    </div>
  );
}
