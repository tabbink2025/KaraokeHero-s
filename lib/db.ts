import Database from 'better-sqlite3';
import path from 'path';
import { THEMES, SONGS, DEFAULT_EVENT } from './seed';

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function init(): Database.Database {
  const db = new Database(path.join(process.cwd(), 'karaoke.db'));
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nightStarted INTEGER NOT NULL DEFAULT 0,
      isPlaying INTEGER NOT NULL DEFAULT 0,
      moderation INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS themes (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, desc TEXT NOT NULL,
      icon TEXT NOT NULL, accent TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS songs (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, artist TEXT NOT NULL,
      themeId TEXT NOT NULL REFERENCES themes(id),
      type TEXT NOT NULL CHECK (type IN ('solo','duet')),
      youtubeVideoId TEXT NOT NULL,
      originalVideoId TEXT NOT NULL DEFAULT '',
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
      language TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY, eventId TEXT NOT NULL REFERENCES events(id),
      name TEXT NOT NULL, createdAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS queue_items (
      id TEXT PRIMARY KEY, eventId TEXT NOT NULL REFERENCES events(id),
      songId TEXT NOT NULL REFERENCES songs(id),
      participantIds TEXT NOT NULL,
      mode TEXT NOT NULL CHECK (mode IN ('theme-choice','solo-star','dynamic-duet')),
      status TEXT NOT NULL CHECK (status IN ('queued','playing','done','skipped')),
      version TEXT NOT NULL DEFAULT 'karaoke',
      position INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      finishedAt INTEGER
    );
    CREATE TABLE IF NOT EXISTS duet_pool (
      id TEXT PRIMARY KEY, eventId TEXT NOT NULL REFERENCES events(id),
      participantId TEXT NOT NULL REFERENCES participants(id),
      joinedAt INTEGER NOT NULL
    );
  `);

  // migrate older DBs that predate version/originalVideoId columns
  const cols = (t: string) => (db.prepare(`PRAGMA table_info(${t})`).all() as { name: string }[]).map((c) => c.name);
  if (!cols('songs').includes('originalVideoId'))
    db.exec("ALTER TABLE songs ADD COLUMN originalVideoId TEXT NOT NULL DEFAULT ''");
  if (!cols('queue_items').includes('version'))
    db.exec("ALTER TABLE queue_items ADD COLUMN version TEXT NOT NULL DEFAULT 'karaoke'");

  const seedThemes = db.prepare(
    'INSERT OR IGNORE INTO themes (id, name, desc, icon, accent) VALUES (@id, @name, @desc, @icon, @accent)'
  );
  const seedSongs = db.prepare(
    `INSERT OR IGNORE INTO songs (id, title, artist, themeId, type, youtubeVideoId, originalVideoId, difficulty, language)
     VALUES (@id, @title, @artist, @themeId, @type, @youtubeVideoId, @originalVideoId, @difficulty, @language)`
  );
  db.transaction(() => {
    for (const t of THEMES) seedThemes.run(t);
    for (const s of SONGS) seedSongs.run(s);
    db.prepare('INSERT OR IGNORE INTO events (id, name) VALUES (?, ?)').run(DEFAULT_EVENT.id, DEFAULT_EVENT.name);
  })();

  return db;
}

export function getDb(): Database.Database {
  if (!global.__db) global.__db = init();
  return global.__db;
}
