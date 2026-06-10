import { randomBytes } from 'crypto';
import { getDb } from './db';
import type { EventState, Participant, QueueItem, Song, QueueMode } from './types';

const genId = (p: string) => p + '_' + randomBytes(5).toString('hex');

declare global {
  // eslint-disable-next-line no-var
  var __io: { to: (room: string) => { emit: (ev: string, data: unknown) => void } } | undefined;
}

const MAX_ACTIVE_PER_PARTICIPANT = 2;
const RECENTLY_PLAYED_WINDOW = 6;

/* ---------------- reads ---------------- */

interface QueueRow extends Omit<QueueItem, 'participantIds'> { participantIds: string; position: number }

function rowToItem(r: QueueRow): QueueItem {
  const { position, ...rest } = r;
  void position;
  return { ...rest, participantIds: JSON.parse(r.participantIds) };
}

function queueFor(eventId: string): QueueItem[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM queue_items WHERE eventId = ? ORDER BY position').all(eventId) as QueueRow[]).map(rowToItem);
}

function recentlyPlayed(eventId: string): string[] {
  const db = getDb();
  return (db.prepare(
    `SELECT songId FROM queue_items WHERE eventId = ? AND status IN ('done','skipped')
     ORDER BY finishedAt DESC LIMIT ?`
  ).all(eventId, RECENTLY_PLAYED_WINDOW) as { songId: string }[]).map((r) => r.songId);
}

export function getEventState(eventId: string): EventState | null {
  const db = getDb();
  const ev = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId) as
    | { id: string; name: string; nightStarted: number; isPlaying: number; moderation: number }
    | undefined;
  if (!ev) return null;
  return {
    event: { id: ev.id, name: ev.name },
    themes: db.prepare('SELECT * FROM themes').all() as EventState['themes'],
    songs: db.prepare('SELECT * FROM songs').all() as Song[],
    participants: db.prepare('SELECT * FROM participants WHERE eventId = ? ORDER BY createdAt').all(eventId) as Participant[],
    queue: queueFor(eventId),
    duetPool: db.prepare('SELECT * FROM duet_pool WHERE eventId = ? ORDER BY joinedAt').all(eventId) as EventState['duetPool'],
    recentlyPlayed: recentlyPlayed(eventId),
    playback: { nightStarted: !!ev.nightStarted, isPlaying: !!ev.isPlaying },
    moderation: !!ev.moderation,
  };
}

export function broadcast(eventId: string) {
  global.__io?.to('event:' + eventId).emit('state', getEventState(eventId));
}

/* ---------------- helpers ---------------- */

function activeCountFor(eventId: string, participantId: string): number {
  return queueFor(eventId).filter(
    (q) => (q.status === 'queued' || q.status === 'playing') && q.participantIds.includes(participantId)
  ).length;
}

function nextPosition(eventId: string): number {
  const db = getDb();
  const r = db.prepare('SELECT COALESCE(MAX(position), 0) AS m FROM queue_items WHERE eventId = ?').get(eventId) as { m: number };
  return r.m + 1;
}

function insertQueueItem(eventId: string, songId: string, participantIds: string[], mode: QueueMode): QueueItem {
  const db = getDb();
  const item: QueueItem = { id: genId('q'), eventId, songId, participantIds, mode, status: 'queued', createdAt: Date.now() };
  db.prepare(
    `INSERT INTO queue_items (id, eventId, songId, participantIds, mode, status, position, createdAt)
     VALUES (?, ?, ?, ?, ?, 'queued', ?, ?)`
  ).run(item.id, eventId, songId, JSON.stringify(participantIds), mode, nextPosition(eventId), item.createdAt);
  return item;
}

function pickRandom(songs: Song[]): Song {
  return songs[Math.floor(Math.random() * songs.length)];
}

function randomSongOfType(eventId: string, type: 'solo' | 'duet'): Song {
  const db = getDb();
  const all = (db.prepare('SELECT * FROM songs WHERE type = ?').all(type)) as Song[];
  const recent = new Set(recentlyPlayed(eventId));
  const active = new Set(
    queueFor(eventId).filter((q) => q.status === 'queued' || q.status === 'playing').map((q) => q.songId)
  );
  let pool = all.filter((s) => !recent.has(s.id) && !active.has(s.id));
  if (pool.length === 0) pool = all.filter((s) => !recent.has(s.id));
  if (pool.length === 0) pool = all;
  return pickRandom(pool);
}

/* ---------------- actions ---------------- */

export function join(eventId: string, name: string): Participant {
  const db = getDb();
  const p: Participant = { id: genId('part'), eventId, name: name.trim(), createdAt: Date.now() };
  db.prepare('INSERT INTO participants (id, eventId, name, createdAt) VALUES (?, ?, ?, ?)')
    .run(p.id, p.eventId, p.name, p.createdAt);
  broadcast(eventId);
  return p;
}

export function chooseSong(eventId: string, songId: string, participantIds: string[], mode: QueueMode = 'theme-choice') {
  if (activeCountFor(eventId, participantIds[0]) >= MAX_ACTIVE_PER_PARTICIPANT) {
    return { ok: false as const, message: 'You already have 2 songs in the queue. Wait until one is sung!' };
  }
  const item = insertQueueItem(eventId, songId, participantIds, mode);
  broadcast(eventId);
  const position = queueFor(eventId).filter((q) => q.status === 'queued').findIndex((q) => q.id === item.id) + 1;
  return { ok: true as const, position, item };
}

export function randomSolo(eventId: string): Song {
  return randomSongOfType(eventId, 'solo');
}

export function joinDuetPool(eventId: string, participantId: string) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM duet_pool WHERE eventId = ? AND participantId = ?').get(eventId, participantId);
  if (!existing) {
    db.prepare('INSERT INTO duet_pool (id, eventId, participantId, joinedAt) VALUES (?, ?, ?, ?)')
      .run(genId('dp'), eventId, participantId, Date.now());
  }
  const pool = db.prepare('SELECT * FROM duet_pool WHERE eventId = ? ORDER BY joinedAt LIMIT 2').all(eventId) as
    { id: string; participantId: string }[];
  if (pool.length >= 2) {
    const song = randomSongOfType(eventId, 'duet');
    const partnerIds = [pool[0].participantId, pool[1].participantId];
    insertQueueItem(eventId, song.id, partnerIds, 'dynamic-duet');
    db.prepare('DELETE FROM duet_pool WHERE id IN (?, ?)').run(pool[0].id, pool[1].id);
    broadcast(eventId);
    return { matched: true as const, song, partnerIds };
  }
  broadcast(eventId);
  return { matched: false as const };
}

export function leaveDuetPool(eventId: string, participantId: string) {
  getDb().prepare('DELETE FROM duet_pool WHERE eventId = ? AND participantId = ?').run(eventId, participantId);
  broadcast(eventId);
}

export function startNight(eventId: string) {
  getDb().prepare('UPDATE events SET nightStarted = 1 WHERE id = ?').run(eventId);
  broadcast(eventId);
}

export function playItem(eventId: string, id: string) {
  const db = getDb();
  db.transaction(() => {
    db.prepare("UPDATE queue_items SET status = 'queued' WHERE eventId = ? AND status = 'playing'").run(eventId);
    db.prepare("UPDATE queue_items SET status = 'playing' WHERE id = ?").run(id);
    db.prepare('UPDATE events SET isPlaying = 1, nightStarted = 1 WHERE id = ?').run(eventId);
  })();
  broadcast(eventId);
}

export function startCurrentOrNext(eventId: string) {
  const q = queueFor(eventId);
  const current = q.find((x) => x.status === 'playing');
  if (current) {
    getDb().prepare('UPDATE events SET isPlaying = 1, nightStarted = 1 WHERE id = ?').run(eventId);
    broadcast(eventId);
    return;
  }
  const next = q.find((x) => x.status === 'queued');
  if (next) playItem(eventId, next.id);
  else startNight(eventId);
}

export function pause(eventId: string) {
  getDb().prepare('UPDATE events SET isPlaying = 0 WHERE id = ?').run(eventId);
  broadcast(eventId);
}

export function resume(eventId: string) {
  getDb().prepare('UPDATE events SET isPlaying = 1 WHERE id = ?').run(eventId);
  broadcast(eventId);
}

function finishItem(eventId: string, id: string, status: 'done' | 'skipped') {
  const db = getDb();
  db.transaction(() => {
    db.prepare('UPDATE queue_items SET status = ?, finishedAt = ? WHERE id = ?').run(status, Date.now(), id);
    db.prepare('UPDATE events SET isPlaying = 0 WHERE id = ?').run(eventId);
    // auto-advance: promote next queued item
    const next = db.prepare(
      "SELECT id FROM queue_items WHERE eventId = ? AND status = 'queued' ORDER BY position LIMIT 1"
    ).get(eventId) as { id: string } | undefined;
    if (next) db.prepare("UPDATE queue_items SET status = 'playing' WHERE id = ?").run(next.id);
  })();
  broadcast(eventId);
}

export const markDone = (eventId: string, id: string) => finishItem(eventId, id, 'done');
export const skip = (eventId: string, id: string) => finishItem(eventId, id, 'skipped');

export function removeItem(eventId: string, id: string) {
  getDb().prepare('DELETE FROM queue_items WHERE id = ?').run(id);
  broadcast(eventId);
}

export function moveItem(eventId: string, id: string, dir: -1 | 1) {
  const db = getDb();
  const queued = db.prepare(
    "SELECT id, position FROM queue_items WHERE eventId = ? AND status = 'queued' ORDER BY position"
  ).all(eventId) as { id: string; position: number }[];
  const at = queued.findIndex((q) => q.id === id);
  const swapWith = at + dir;
  if (at < 0 || swapWith < 0 || swapWith >= queued.length) return;
  db.transaction(() => {
    db.prepare('UPDATE queue_items SET position = ? WHERE id = ?').run(queued[swapWith].position, queued[at].id);
    db.prepare('UPDATE queue_items SET position = ? WHERE id = ?').run(queued[at].position, queued[swapWith].id);
  })();
  broadcast(eventId);
}

export function toggleModeration(eventId: string) {
  getDb().prepare('UPDATE events SET moderation = 1 - moderation WHERE id = ?').run(eventId);
  broadcast(eventId);
}

export function setEventName(eventId: string, name: string) {
  const n = (name || '').trim();
  if (!n) return;
  getDb().prepare('UPDATE events SET name = ? WHERE id = ?').run(n, eventId);
  broadcast(eventId);
}

export function resetEvent(eventId: string) {
  const db = getDb();
  db.transaction(() => {
    db.prepare('DELETE FROM queue_items WHERE eventId = ?').run(eventId);
    db.prepare('DELETE FROM duet_pool WHERE eventId = ?').run(eventId);
    db.prepare('DELETE FROM participants WHERE eventId = ?').run(eventId);
    db.prepare('UPDATE events SET nightStarted = 0, isPlaying = 0, moderation = 1 WHERE id = ?').run(eventId);
  })();
  broadcast(eventId);
}
