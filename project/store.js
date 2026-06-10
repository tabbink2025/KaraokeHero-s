/* KaraokeHero's — shared live store (plain JS, loaded before babel scripts) */
(function () {
  const KEY = 'karaokehero_state_v3';
  const genId = (p) => p + '_' + Math.random().toString(36).slice(2, 9);

  /* ---------------- Seed data ---------------- */
  const THEMES = [
    { id: 'party',   name: 'Party Classics',  desc: 'Floor-fillers everyone knows', icon: 'ball',  accent: 'gold' },
    { id: 'guilty',  name: 'Guilty Pleasures', desc: 'You secretly love these',      icon: 'heart', accent: 'pink' },
    { id: 'rock',    name: 'Rock Anthems',     desc: 'Hands in the air, lighters up', icon: 'bolt',  accent: 'orange' },
    { id: 'nl',      name: 'Nederlandstalig',  desc: 'Meezingers van eigen bodem',    icon: 'diamond', accent: 'teal' },
    { id: 'duet',    name: 'Duetten',          desc: 'Grab a partner and harmonise',  icon: 'duo',   accent: 'violet' },
    { id: 'movie',   name: 'Disney & Movie',   desc: 'Soundtracks & sing-alongs',     icon: 'play',  accent: 'cyan' },
  ];

  // A few reliably-embeddable IDs reused so the screen demo actually plays video.
  const VID = {
    dancingQueen: 'xFrGuyw1V8s',
    ymca: 'CS9OO0S5w2k',
    september: 'Gs069dndIYk',
    survive: '6dYWe1c3OyU',
    stayinAlive: 'I_izvAbhExY',
    hotStuff: 'y7BItOkkU9w',
    bohemian: 'fJ9rUzIMcZQ',
    prayer: 'lDK9QqIzhwk',
    believin: '1k8craCGpgs',
    takeOnMe: 'djV11Xbc914',
  };

  const S = (o) => Object.assign({ type: 'solo', language: 'EN' }, o);
  const D = (o) => Object.assign({ type: 'duet', language: 'EN' }, o);

  const SONGS = [
    // Party Classics
    S({ id: 'p1', title: 'Dancing Queen',  artist: 'ABBA',            themeId: 'party', difficulty: 'easy',   ytid: VID.dancingQueen }),
    S({ id: 'p2', title: 'Y.M.C.A.',        artist: 'Village People',  themeId: 'party', difficulty: 'easy',   ytid: VID.ymca }),
    S({ id: 'p3', title: 'September',        artist: 'Earth, Wind & Fire', themeId: 'party', difficulty: 'medium', ytid: VID.september }),
    S({ id: 'p4', title: 'I Will Survive',  artist: 'Gloria Gaynor',   themeId: 'party', difficulty: 'medium', ytid: VID.survive }),
    S({ id: 'p5', title: "Stayin' Alive",   artist: 'Bee Gees',        themeId: 'party', difficulty: 'hard',   ytid: VID.stayinAlive }),
    S({ id: 'p6', title: 'Hot Stuff',       artist: 'Donna Summer',    themeId: 'party', difficulty: 'medium', ytid: VID.hotStuff }),
    // Guilty Pleasures
    S({ id: 'g1', title: '...Baby One More Time', artist: 'Britney Spears', themeId: 'guilty', difficulty: 'easy',   ytid: VID.dancingQueen }),
    S({ id: 'g2', title: 'Wannabe',          artist: 'Spice Girls',    themeId: 'guilty', difficulty: 'medium', ytid: VID.dancingQueen }),
    S({ id: 'g3', title: 'Barbie Girl',      artist: 'Aqua',           themeId: 'guilty', difficulty: 'easy',   ytid: VID.dancingQueen }),
    S({ id: 'g4', title: 'MMMBop',           artist: 'Hanson',         themeId: 'guilty', difficulty: 'hard',   ytid: VID.dancingQueen }),
    S({ id: 'g5', title: 'Mr. Brightside',   artist: 'The Killers',    themeId: 'guilty', difficulty: 'medium', ytid: VID.dancingQueen }),
    // Rock Anthems
    S({ id: 'r1', title: 'Bohemian Rhapsody', artist: 'Queen',         themeId: 'rock', difficulty: 'hard',   ytid: VID.bohemian }),
    S({ id: 'r2', title: "Livin' on a Prayer", artist: 'Bon Jovi',     themeId: 'rock', difficulty: 'medium', ytid: VID.prayer }),
    S({ id: 'r3', title: "Don't Stop Believin'", artist: 'Journey',    themeId: 'rock', difficulty: 'medium', ytid: VID.believin }),
    S({ id: 'r4', title: 'Highway to Hell',  artist: 'AC/DC',          themeId: 'rock', difficulty: 'hard',   ytid: VID.prayer }),
    S({ id: 'r5', title: 'Take On Me',       artist: 'a-ha',           themeId: 'rock', difficulty: 'hard',   ytid: VID.takeOnMe }),
    // Nederlandstalig
    S({ id: 'n1', title: 'Het is een nacht', artist: 'Guus Meeuwis',   themeId: 'nl', difficulty: 'easy',   language: 'NL', ytid: VID.dancingQueen }),
    S({ id: 'n2', title: 'Dromen zijn bedrog', artist: 'Marco Borsato', themeId: 'nl', difficulty: 'medium', language: 'NL', ytid: VID.dancingQueen }),
    S({ id: 'n3', title: 'Bloed, zweet en tranen', artist: 'André Hazes', themeId: 'nl', difficulty: 'medium', language: 'NL', ytid: VID.dancingQueen }),
    S({ id: 'n4', title: 'Links Rechts',     artist: 'Snollebollekes', themeId: 'nl', difficulty: 'easy',   language: 'NL', ytid: VID.dancingQueen }),
    S({ id: 'n5', title: 'Brabant',          artist: 'Guus Meeuwis',   themeId: 'nl', difficulty: 'hard',   language: 'NL', ytid: VID.dancingQueen }),
    // Duetten
    D({ id: 'd1', title: 'Summer Nights',    artist: 'John Travolta & Olivia Newton-John', themeId: 'duet', difficulty: 'medium', ytid: VID.dancingQueen }),
    D({ id: 'd2', title: 'Islands in the Stream', artist: 'Kenny Rogers & Dolly Parton', themeId: 'duet', difficulty: 'medium', ytid: VID.dancingQueen }),
    D({ id: 'd3', title: "Don't Go Breaking My Heart", artist: 'Elton John & Kiki Dee', themeId: 'duet', difficulty: 'easy', ytid: VID.dancingQueen }),
    D({ id: 'd4', title: 'Shallow',          artist: 'Lady Gaga & Bradley Cooper', themeId: 'duet', difficulty: 'hard', ytid: VID.dancingQueen }),
    D({ id: 'd5', title: 'Endless Love',     artist: 'Diana Ross & Lionel Richie', themeId: 'duet', difficulty: 'hard', ytid: VID.dancingQueen }),
    // Disney & Movie
    S({ id: 'm1', title: 'Let It Go',        artist: 'Frozen',         themeId: 'movie', difficulty: 'hard',   ytid: VID.dancingQueen }),
    D({ id: 'm2', title: 'A Whole New World', artist: 'Aladdin',       themeId: 'movie', difficulty: 'medium', ytid: VID.dancingQueen }),
    S({ id: 'm3', title: 'Circle of Life',   artist: 'The Lion King',  themeId: 'movie', difficulty: 'hard',   ytid: VID.dancingQueen }),
    S({ id: 'm4', title: 'My Heart Will Go On', artist: 'Titanic',     themeId: 'movie', difficulty: 'medium', ytid: VID.dancingQueen }),
    S({ id: 'm5', title: 'Eye of the Tiger', artist: 'Rocky',          themeId: 'movie', difficulty: 'medium', ytid: VID.prayer }),
  ];

  /* ---------------- Initial state ---------------- */
  function seed() {
    const me = { id: genId('part'), name: '', createdAt: Date.now() };
    const guests = [
      { id: 'part_lobby', name: 'Sanne',  createdAt: Date.now() - 600000 },
      { id: 'part_marco', name: 'Marco',  createdAt: Date.now() - 540000 },
      { id: 'part_emma',  name: 'Emma',   createdAt: Date.now() - 480000 },
      { id: 'part_jules', name: 'Jules',  createdAt: Date.now() - 300000 },
    ];
    return {
      event: { id: 'zomerfeest', name: 'Zomerfeest 2026' },
      themes: THEMES,
      songs: SONGS,
      me,
      participants: [me, ...guests],
      queue: [
        { id: genId('q'), songId: 'p1', participantIds: ['part_lobby'], mode: 'theme-choice', status: 'playing', createdAt: Date.now() - 200000 },
        { id: genId('q'), songId: 'd1', participantIds: ['part_marco', 'part_emma'], mode: 'dynamic-duet', status: 'queued', createdAt: Date.now() - 150000 },
        { id: genId('q'), songId: 'r3', participantIds: ['part_jules'], mode: 'theme-choice', status: 'queued', createdAt: Date.now() - 90000 },
      ],
      duetPool: [],
      recentlyPlayed: ['g1', 'm1'],
      playback: { nightStarted: true, isPlaying: false },
      moderation: true,
    };
  }

  /* ---------------- Store core ---------------- */
  let state = load() || seed();
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function emit() { listeners.forEach((fn) => fn()); }
  function commit() { persist(); emit(); }

  window.addEventListener('storage', (e) => {
    if (e.key === KEY && e.newValue) {
      try { state = JSON.parse(e.newValue); emit(); } catch (err) {}
    }
  });

  /* ---------------- Selectors ---------------- */
  const sel = {
    songById: (id) => state.songs.find((s) => s.id === id),
    themeById: (id) => state.themes.find((t) => t.id === id),
    partById: (id) => state.participants.find((p) => p.id === id),
    partName: (id) => { const p = state.participants.find((x) => x.id === id); return p ? p.name : '???'; },
    songsByTheme: (tid) => state.songs.filter((s) => s.themeId === tid),
    current: () => state.queue.find((q) => q.status === 'playing'),
    upcoming: () => state.queue.filter((q) => q.status === 'queued'),
    activeForParticipant: (pid) =>
      state.queue.filter((q) => (q.status === 'queued' || q.status === 'playing') && q.participantIds.includes(pid)),
  };

  /* ---------------- Actions ---------------- */
  function setMyName(name) {
    state.me.name = name.trim();
    const exists = state.participants.find((p) => p.id === state.me.id);
    if (!exists) state.participants = [...state.participants, state.me];
    commit();
  }

  function canAdd(pid) {
    return sel.activeForParticipant(pid).length < 2;
  }

  function chooseSong({ songId, participantIds, mode }) {
    const owner = participantIds[0];
    if (!canAdd(owner)) {
      return { ok: false, message: 'You already have 2 songs in the queue. Wait until one is sung!' };
    }
    const item = {
      id: genId('q'), songId, participantIds,
      mode: mode || 'theme-choice', status: 'queued', createdAt: Date.now(),
    };
    state.queue = [...state.queue, item];
    commit();
    const pos = sel.upcoming().findIndex((q) => q.id === item.id) + 1;
    return { ok: true, position: pos, item };
  }

  function randomSolo() {
    const recent = new Set(state.recentlyPlayed);
    const queued = new Set(state.queue.filter((q) => q.status !== 'done' && q.status !== 'skipped').map((q) => q.songId));
    let pool = state.songs.filter((s) => s.type === 'solo' && !recent.has(s.id) && !queued.has(s.id));
    if (pool.length === 0) pool = state.songs.filter((s) => s.type === 'solo' && !recent.has(s.id));
    if (pool.length === 0) pool = state.songs.filter((s) => s.type === 'solo');
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function randomDuetSong() {
    const recent = new Set(state.recentlyPlayed);
    let pool = state.songs.filter((s) => s.type === 'duet' && !recent.has(s.id));
    if (pool.length === 0) pool = state.songs.filter((s) => s.type === 'duet');
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function joinDuetPool(pid) {
    if (state.duetPool.find((e) => e.participantId === pid)) {
      // already waiting
    } else {
      state.duetPool = [...state.duetPool, { id: genId('dp'), participantId: pid, joinedAt: Date.now() }];
    }
    // try to match
    if (state.duetPool.length >= 2) {
      const [a, b] = state.duetPool.slice(0, 2);
      const song = randomDuetSong();
      const item = {
        id: genId('q'), songId: song.id,
        participantIds: [a.participantId, b.participantId],
        mode: 'dynamic-duet', status: 'queued', createdAt: Date.now(),
      };
      state.queue = [...state.queue, item];
      state.duetPool = state.duetPool.slice(2);
      commit();
      return { matched: true, song, partnerIds: [a.participantId, b.participantId], me: pid };
    }
    commit();
    return { matched: false };
  }

  function leaveDuetPool(pid) {
    state.duetPool = state.duetPool.filter((e) => e.participantId !== pid);
    commit();
  }

  // admin
  function startNight() { state.playback.nightStarted = true; commit(); }
  function playItem(id) {
    state.queue = state.queue.map((q) => {
      if (q.id === id) return { ...q, status: 'playing' };
      if (q.status === 'playing') return { ...q, status: 'queued' };
      return q;
    });
    state.playback.isPlaying = true;
    commit();
  }
  function startCurrentOrNext() {
    const cur = sel.current();
    if (cur) { state.playback.isPlaying = true; commit(); return; }
    const next = sel.upcoming()[0];
    if (next) playItem(next.id);
  }
  function pause() { state.playback.isPlaying = false; commit(); }
  function resume() { if (sel.current()) { state.playback.isPlaying = true; commit(); } }
  function finishItem(id, status) {
    const it = state.queue.find((q) => q.id === id);
    if (it) state.recentlyPlayed = [it.songId, ...state.recentlyPlayed].slice(0, 6);
    state.queue = state.queue.map((q) => (q.id === id ? { ...q, status } : q));
    state.playback.isPlaying = false;
    // auto-advance: promote next queued to playing
    const next = state.queue.find((q) => q.status === 'queued');
    if (next) state.queue = state.queue.map((q) => (q.id === next.id ? { ...q, status: 'playing' } : q));
    commit();
  }
  function markDone(id) { finishItem(id, 'done'); }
  function skip(id) { finishItem(id, 'skipped'); }
  function removeItem(id) { state.queue = state.queue.filter((q) => q.id !== id); commit(); }
  function moveItem(id, dir) {
    const q = [...state.queue];
    const queuedIdx = q.map((x, i) => ({ x, i })).filter(o => o.x.status === 'queued');
    const at = queuedIdx.findIndex(o => o.x.id === id);
    if (at < 0) return;
    const swapWith = dir < 0 ? at - 1 : at + 1;
    if (swapWith < 0 || swapWith >= queuedIdx.length) return;
    const i1 = queuedIdx[at].i, i2 = queuedIdx[swapWith].i;
    [q[i1], q[i2]] = [q[i2], q[i1]];
    state.queue = q;
    commit();
  }
  function toggleModeration() { state.moderation = !state.moderation; commit(); }
  function setEventName(name) { const n = (name || '').trim(); if (n) { state.event = { ...state.event, name: n }; commit(); } }
  function addParticipant(name) {
    const p = { id: genId('part'), name: name.trim(), createdAt: Date.now() };
    state.participants = [...state.participants, p];
    commit();
    return p;
  }
  function resetAll() { state = seed(); commit(); }

  window.Store = {
    KEY,
    getState: () => state,
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    sel,
    setMyName, canAdd, chooseSong, randomSolo, randomDuetSong,
    joinDuetPool, leaveDuetPool,
    startNight, playItem, startCurrentOrNext, pause, resume,
    markDone, skip, removeItem, moveItem, toggleModeration, setEventName, addParticipant, resetAll,
  };
})();
