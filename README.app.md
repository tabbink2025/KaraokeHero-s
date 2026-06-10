# KaraokeHero's 🪩

Web-based karaoke control app for a private party — implemented from the
Claude Design handoff in `project/` (see `README.md` and `chats/` for the
design history).

Three surfaces share one live queue over Socket.io:

- **Participant (mobile-first)** — `/event/[eventId]`
  Name entry → hub → 6 themed rooms → song list (title, artist, solo/duet,
  difficulty, language, choose) → live queue. Duet songs open a sheet
  (have a partner / random partner / join the duet pool). Random modes at
  `/event/[eventId]/random`: **Solo Star** (random solo pick, confirm before
  queueing, skips recently played) and **Dynamic Duets** (join the pool,
  get matched live with the next guest, duet auto-queued).
- **Big screen / TV** — `/screen/[eventId]`
  Large YouTube player (gated behind a "Start karaoke night" button because
  browsers block autoplay with sound), slim now-singing strip, compact
  up-next list, and a scan-to-join QR in the bottom-right corner.
- **Admin** — `/admin/[eventId]`
  Current-song controls (start/pause/skip/mark done), queue reorder /
  play-now / remove, duet pool, guest list, moderation toggle (on by
  default), editable event name (click the name → pencil), and a reset.

## Stack

Next.js (App Router) + TypeScript, SQLite (better-sqlite3), Socket.io via a
custom server on **port 3000** — works behind a Cloudflare tunnel.

## Run it

```bash
npm install
npm run dev          # development
# or
npm run build && npm start   # production
```

Then open:

- Guests: `http://localhost:3000/event/zomerfeest` (or scan the QR on the screen)
- TV: `http://localhost:3000/screen/zomerfeest`
- Admin: `http://localhost:3000/admin/zomerfeest`

The database (`karaoke.db`) is created and seeded on first run with the six
themes and example songs. The default event is `zomerfeest`; to host another
event just insert a row into the `events` table.

## Rules implemented

- Max 2 active (queued or playing) songs per participant.
- Random modes avoid recently played songs (last 6 done/skipped) and songs
  already in the queue.
- Finishing or skipping a song auto-advances the queue.
- Only YouTube video IDs are stored; the screen embeds
  `youtube-nocookie.com` with `enablejsapi=1`.

## Notes / next steps

- The seeded YouTube IDs are placeholders (a few reliably embeddable videos
  reused). Swap in real karaoke-video IDs in `lib/seed.ts` before the party.
- The moderation toggle is persisted but does not yet hold songs for
  approval (matching the validated prototype). Wiring a `pending` status +
  an approve button in admin is a small follow-up.
- Admin and screen pages are unauthenticated by design (private tunnel link).
