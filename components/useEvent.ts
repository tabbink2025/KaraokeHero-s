'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { EventState, Participant, QueueItem, Song } from '@/lib/types';

let socket: Socket | null = null;
function getSocket(): Socket {
  if (!socket) socket = io({ path: '/socket' });
  return socket;
}

export function useEventState(eventId: string): EventState | null {
  const [state, setState] = useState<EventState | null>(null);
  useEffect(() => {
    let live = true;
    fetch(`/api/events/${eventId}/state`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => { if (live && s) setState(s); });
    const s = getSocket();
    s.emit('join', eventId);
    const onState = (st: EventState) => { if (st?.event?.id === eventId) setState(st); };
    const onConnect = () => s.emit('join', eventId);
    s.on('state', onState);
    s.on('connect', onConnect);
    return () => { live = false; s.off('state', onState); s.off('connect', onConnect); };
  }, [eventId]);
  return state;
}

export function useAct(eventId: string) {
  return useCallback(
    async (type: string, payload: Record<string, unknown> = {}) => {
      const res = await fetch(`/api/events/${eventId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...payload }),
      });
      return res.json();
    },
    [eventId]
  );
}

/* "Me" — the local participant identity, stored per event in localStorage. */
export function useMe(eventId: string, state: EventState | null): {
  me: Participant | null;
  ready: boolean;
  join: (name: string) => Promise<void>;
} {
  const [meId, setMeId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const key = 'kh_me_' + eventId;
  const act = useAct(eventId);

  useEffect(() => {
    setMeId(localStorage.getItem(key));
    setReady(true);
  }, [key]);

  const me = useMemo(() => {
    if (!state || !meId) return null;
    return state.participants.find((p) => p.id === meId) ?? null;
  }, [state, meId]);

  const join = useCallback(async (name: string) => {
    const r = await act('join', { name });
    if (r.participant) {
      localStorage.setItem(key, r.participant.id);
      setMeId(r.participant.id);
    }
  }, [act, key]);

  return { me, ready, join };
}

/* shared selectors mirroring the prototype store */
export const sel = {
  songById: (st: EventState, id: string): Song | undefined => st.songs.find((s) => s.id === id),
  current: (st: EventState): QueueItem | undefined => st.queue.find((q) => q.status === 'playing'),
  upcoming: (st: EventState): QueueItem[] => st.queue.filter((q) => q.status === 'queued'),
  activeForParticipant: (st: EventState, pid: string): QueueItem[] =>
    st.queue.filter((q) => (q.status === 'queued' || q.status === 'playing') && q.participantIds.includes(pid)),
  songsByTheme: (st: EventState, tid: string): Song[] => st.songs.filter((s) => s.themeId === tid),
};
