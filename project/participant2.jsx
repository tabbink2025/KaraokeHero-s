/* participant2.jsx — random modes, queue, and the app container */
const { useState: p2Use, useEffect: p2Eff, useRef: p2Ref } = React;

/* ---------- Random hub ---------- */
function RandomScreen({ go, me }) {
  return (
    <>
      <PhoneHead title="Home" onBack={() => go({ name: 'hub' })} me={me} showMe />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow">Feeling lucky</div>
          <h1 className="h-lg" style={{ margin: '8px 0 18px' }}>Surprise me</h1>
          <div className="hub-actions">
            <button className="hub-card accent-gold" onClick={() => go({ name: 'soloStar' })}>
              <span className="ic"><Icon name="star" /></span>
              <span className="tx"><h3>Solo Star</h3><p>We pick a solo song. You confirm before it's queued.</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </button>
            <button className="hub-card accent-violet" onClick={() => go({ name: 'dynamicDuet' })}>
              <span className="ic"><Icon name="duo" /></span>
              <span className="tx"><h3>Dynamic Duets</h3><p>Join the pool. We pair you up and pick a duet.</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </button>
          </div>
          <div className="card-soft" style={{ marginTop: 18, display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--gold)', marginTop: 1 }}><Icon name="sparkle" size={18} /></span>
            <p className="muted" style={{ margin: 0, fontSize: 12.5, lineHeight: 1.45 }}>Recently played songs are skipped, so you won't get a repeat of what just happened on stage.</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Solo Star ---------- */
function SoloStarScreen({ go, me, onAdded }) {
  const [song, setSong] = p2Use(() => Store.randomSolo());
  const [spinning, setSpin] = p2Use(true);
  p2Eff(() => { const t = setTimeout(() => setSpin(false), 900); return () => clearTimeout(t); }, [song]);
  function reroll() { setSpin(true); setSong(Store.randomSolo()); }
  function confirm() {
    const r = Store.chooseSong({ songId: song.id, participantIds: [me.id], mode: 'solo-star' });
    onAdded(r, song);
  }
  return (
    <>
      <PhoneHead title="Surprise me" onBack={() => go({ name: 'random' })} me={me} showMe />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow" style={{ textAlign: 'center' }}>Solo Star</div>
          <p className="muted" style={{ textAlign: 'center', margin: '8px 0 20px', fontSize: 14 }}>Your random solo pick</p>
          <div className="confirm-card">
            <div className="spin"><span><Icon name={spinning ? 'shuffle' : 'star'} size={22} /></span></div>
            <div style={{ minHeight: 70 }}>
              {spinning
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary" disabled={spinning} onClick={confirm}><Icon name="plus" size={18} /> Add to queue</button>
            <button className="btn btn-outline" disabled={spinning} onClick={reroll}><Icon name="shuffle" size={18} /> Try another</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Dynamic Duets ---------- */
function DynamicDuetScreen({ go, me, onAdded }) {
  const st = useStore();
  const [phase, setPhase] = p2Use('joining'); // joining | waiting | matched
  const [match, setMatch] = p2Use(null);
  const matchedRef = p2Ref(false);

  p2Eff(() => {
    const r = Store.joinDuetPool(me.id);
    if (r.matched) { matchedRef.current = true; setMatch(r); setPhase('matched'); return; }
    setPhase('waiting');
    const t = setTimeout(() => {
      const pool = Store.getState().duetPool.map((e) => e.participantId);
      const buddy = Store.getState().participants.find((p) => p.name && p.id !== me.id && !pool.includes(p.id))
        || { id: Store.addParticipant('Robin').id };
      const r2 = Store.joinDuetPool(buddy.id);
      if (r2.matched) { matchedRef.current = true; setMatch(r2); setPhase('matched'); }
    }, 3400);
    return () => { clearTimeout(t); if (!matchedRef.current) Store.leaveDuetPool(me.id); };
  }, []);

  const partnerId = match ? match.partnerIds.find((id) => id !== me.id) : null;

  return (
    <>
      <PhoneHead title="Surprise me" onBack={() => go({ name: 'random' })} me={me} showMe />
      <div className="p-scroll">
        <div className="p-pad accent-violet" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Dynamic Duets</div>
          {phase !== 'matched' ? (
            <>
              <h1 className="h-lg" style={{ margin: '10px 0 4px' }}>Finding your duet partner…</h1>
              <p className="muted" style={{ fontSize: 14 }}>You're in the pool. Hang tight — we'll pair you with the next available singer.</p>
              <div className="pulse-ring" style={{ marginTop: 30 }}><span className="core"><Icon name="duo" size={26} /></span></div>
              <div className="pool-chip" style={{ marginTop: 20 }}><span className="dot" style={{ background: 'currentColor' }} /> In the duet pool</div>
              <button className="btn btn-outline" style={{ marginTop: 28 }} onClick={() => go({ name: 'random' })}>Leave the pool</button>
            </>
          ) : (
            <>
              <div className="spin" style={{ width: 64, height: 64, margin: '20px auto 16px', borderRadius: '50%', background: 'conic-gradient(from 0deg, var(--violet), var(--pink), var(--cyan), var(--violet))', display: 'grid', placeItems: 'center' }}>
                <span style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--violet)' }}><Icon name="check" size={24} /></span>
              </div>
              <h1 className="h-lg" style={{ marginBottom: 6 }}>It's a match!</h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '12px 0' }}>
                <Avatar id={me.id} name={me.name} /><span className="muted" style={{ fontWeight: 700 }}>+</span><Avatar id={partnerId} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>You & {Store.sel.partName(partnerId)}</span>
              </div>
              <div className="confirm-card" style={{ marginTop: 8 }}>
                <span className="badge badge-duet" style={{ marginBottom: 8 }}>Your duet</span>
                <div className="h-lg" style={{ marginBottom: 4 }}>{match.song.title}</div>
                <div className="muted" style={{ fontSize: 14 }}>{match.song.artist}</div>
              </div>
              <p className="muted" style={{ fontSize: 13, marginTop: 14 }}>Added to the queue automatically.</p>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => go({ name: 'queue' })}><Icon name="clock" size={18} /> See the queue</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- Queue ---------- */
function QueueScreen({ go, me }) {
  const st = useStore();
  const current = Store.sel.current();
  const upcoming = Store.sel.upcoming();
  function row(item, idx) {
    const s = Store.sel.songById(item.songId);
    const mine = item.participantIds.includes(me.id);
    return (
      <div className="song-row" key={item.id} style={mine ? { borderColor: 'var(--gold)' } : null}>
        <span className="ava-stack" style={{ flex: 'none' }}><AvaStack ids={item.participantIds} /></span>
        <div className="meta">
          <div className="ttl">{s.title}</div>
          <div className="art">{s.artist}</div>
          <div className="tags">
            <span className="badge badge-soft">{singerNames(item.participantIds)}{mine ? ' · you' : ''}</span>
            {item.mode === 'dynamic-duet' && <span className="badge badge-duet">Dynamic duet</span>}
            {item.mode === 'solo-star' && <span className="badge badge-line">Solo star</span>}
          </div>
        </div>
        <span className="up-item" style={{ flex: 'none' }}><span className="n" style={{ fontSize: 20 }}>{idx}</span></span>
      </div>
    );
  }
  return (
    <>
      <PhoneHead title="Home" onBack={() => go({ name: 'hub' })} me={me} showMe />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow">Up next on stage</div>
          <h1 className="h-lg" style={{ margin: '8px 0 16px' }}>The queue</h1>
          {current && (() => {
            const s = Store.sel.songById(current.songId);
            return (
              <div className="now-card accent-gold" style={{ marginBottom: 18 }}>
                <div className="lab">● Now singing</div>
                <div className="t" style={{ fontSize: 20 }}>{s.title}</div>
                <div className="a">{s.artist}</div>
                <div className="singers"><AvaStack ids={current.participantIds} /> {singerNames(current.participantIds)}</div>
              </div>
            );
          })()}
          <div className="sec-title" style={{ marginBottom: 10 }}>Up next · {upcoming.length}</div>
          {upcoming.length === 0
            ? <div className="empty">Queue's open — be the next star!</div>
            : <div className="song-list">{upcoming.map((it, i) => row(it, i + 1))}</div>}
          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => go({ name: 'themes' })}><Icon name="plus" size={18} /> Add a song</button>
        </div>
      </div>
    </>
  );
}

/* ---------- Container ---------- */
function ParticipantApp() {
  const st = useStore();
  const me = st.me;
  const [view, setView] = p2Use({ name: 'hub' });
  const [toast, setToast] = p2Use(null);
  const [duetSong, setDuetSong] = p2Use(null);

  if (!me.name) return <NameScreen onJoin={(n) => { Store.setMyName(n); setView({ name: 'hub' }); }} />;

  function result(r, song) {
    if (!r.ok) setToast({ error: true, body: r.message });
    else setToast({ body: <span><b>{song.title}</b> added — you're #{r.position} up next</span> });
  }
  function choose(song) {
    if (song.type === 'duet') { setDuetSong(song); return; }
    result(Store.chooseSong({ songId: song.id, participantIds: [me.id], mode: 'theme-choice' }), song);
  }

  let screen;
  if (view.name === 'hub') screen = <HubScreen go={setView} me={me} />;
  else if (view.name === 'themes') screen = <ThemesScreen go={setView} me={me} />;
  else if (view.name === 'theme') screen = <ThemeSongs go={setView} me={me} themeId={view.themeId} onChoose={choose} />;
  else if (view.name === 'random') screen = <RandomScreen go={setView} me={me} />;
  else if (view.name === 'soloStar') screen = <SoloStarScreen go={setView} me={me} onAdded={(r, s) => { result(r, s); if (r.ok) setView({ name: 'queue' }); }} />;
  else if (view.name === 'dynamicDuet') screen = <DynamicDuetScreen go={setView} me={me} />;
  else if (view.name === 'queue') screen = <QueueScreen go={setView} me={me} />;

  return (
    <>
      {screen}
      {duetSong && (
        <DuetSheet song={duetSong} me={me} onClose={() => setDuetSong(null)}
          onResult={(r, td) => { setDuetSong(null); if (r.goPool) { setView({ name: 'dynamicDuet' }); return; } if (!r.ok) setToast({ error: true, body: r.message }); else setToast(td); }} />
      )}
      <Toast data={toast} onDone={() => setToast(null)} />
    </>
  );
}

Object.assign(window, { RandomScreen, SoloStarScreen, DynamicDuetScreen, QueueScreen, ParticipantApp });
