/* participant.jsx — mobile guest flow */
const { useState: pUse, useEffect: pEff, useRef: pRef } = React;

function PhoneHead({ title, onBack, me, showMe }) {
  return (
    <div className="p-head">
      {onBack
        ? <button className="p-back" onClick={onBack}><Icon name="chevL" size={18} />{title || 'Back'}</button>
        : <Wordmark size="sm" />}
      {showMe && me && <span className="p-me"><Avatar id={me.id} name={me.name} />{me.name}</span>}
    </div>
  );
}

function Toast({ data, onDone }) {
  pEff(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [data]);
  if (!data) return null;
  return (
    <div className="toast">
      <span className="ic"><Icon name={data.error ? 'clock' : 'check'} size={18} /></span>
      <span className="tx">{data.body}</span>
    </div>
  );
}

/* ---------- Name ---------- */
function NameScreen({ onJoin }) {
  const st = useStore();
  const [v, setV] = pUse('');
  return (
    <div className="p-scroll">
      <div className="p-topgap" />
      <div className="p-pad" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100% - 44px)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Wordmark size="lg" /></div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{st.event.name}</div>
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
            <Icon name="mic" size={18} /> Let's sing
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hub ---------- */
function HubScreen({ go, me }) {
  const st = useStore();
  const upcoming = Store.sel.upcoming();
  const current = Store.sel.current();
  const mine = Store.sel.activeForParticipant(me.id);
  return (
    <>
      <PhoneHead me={me} showMe />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow">{st.event.name}</div>
          <h1 className="h-xl" style={{ margin: '8px 0 4px' }}>Hi {me.name.split(' ')[0]} 👋</h1>
          <p className="muted" style={{ marginTop: 0, fontSize: 14.5 }}>
            {mine.length === 0 ? 'You have no songs queued yet. Pick one!' : `You have ${mine.length} song${mine.length > 1 ? 's' : ''} lined up.`}
          </p>

          <div className="hub-actions" style={{ marginTop: 22 }}>
            <button className="hub-card accent-gold" onClick={() => go({ name: 'themes' })}>
              <span className="ic"><Icon name="list" /></span>
              <span className="tx"><h3>Browse themes</h3><p>Six curated rooms of party-ready songs</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </button>
            <button className="hub-card accent-pink" onClick={() => go({ name: 'random' })}>
              <span className="ic"><Icon name="dice" /></span>
              <span className="tx"><h3>Surprise me</h3><p>Solo Star or get matched for a duet</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </button>
            <button className="hub-card accent-teal" onClick={() => go({ name: 'queue' })}>
              <span className="ic"><Icon name="clock" /></span>
              <span className="tx"><h3>The queue</h3><p>{current ? `Now: ${Store.sel.songById(current.songId).title}` : 'Nothing playing yet'} · {upcoming.length} up next</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Themes ---------- */
function ThemesScreen({ go, me }) {
  const st = useStore();
  return (
    <>
      <PhoneHead title="Home" onBack={() => go({ name: 'hub' })} me={me} showMe />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow">Choose a room</div>
          <h1 className="h-lg" style={{ margin: '8px 0 18px' }}>Themes</h1>
          <div className="theme-grid">
            {st.themes.map((t) => (
              <button key={t.id} className={'theme-card accent-' + t.accent} onClick={() => go({ name: 'theme', themeId: t.id })}>
                <span className="ic"><Icon name={THEME_ICON[t.id]} size={22} /></span>
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                </div>
                <span className="cnt">{Store.sel.songsByTheme(t.id).length} songs</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Theme songs ---------- */
function ThemeSongs({ go, me, themeId, onChoose }) {
  const st = useStore();
  const theme = Store.sel.themeById(themeId);
  const songs = Store.sel.songsByTheme(themeId);
  const mineSongIds = new Set(Store.sel.activeForParticipant(me.id).map((q) => q.songId));
  return (
    <>
      <PhoneHead title="Themes" onBack={() => go({ name: 'themes' })} me={me} showMe />
      <div className="p-scroll">
        <div className={'p-pad accent-' + theme.accent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span className="ic" style={{ width: 46, height: 46, borderRadius: 13, display: 'grid', placeItems: 'center', background: 'color-mix(in oklab, var(--acc) 18%, transparent)', color: 'var(--acc)' }}>
              <Icon name={THEME_ICON[themeId]} size={24} />
            </span>
            <div>
              <h1 className="h-lg">{theme.name}</h1>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>{theme.desc}</p>
            </div>
          </div>
          <div className="song-list">
            {songs.map((s) => {
              const added = mineSongIds.has(s.id);
              return (
                <div className="song-row" key={s.id}>
                  <div className="meta">
                    <div className="ttl">{s.title}</div>
                    <div className="art">{s.artist}</div>
                    <div className="tags">
                      <TypeBadge type={s.type} />
                      <Diff d={s.difficulty} />
                      <LangBadge lang={s.language} />
                    </div>
                  </div>
                  <button className={'choose-btn' + (added ? ' added' : '')} disabled={added} onClick={() => onChoose(s)}>
                    {added ? <><Icon name="check" size={15} /> Queued</> : <><Icon name="plus" size={15} /> Choose</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Duet sheet ---------- */
function DuetSheet({ song, me, onClose, onResult }) {
  const st = useStore();
  function havePartner() {
    const r = Store.chooseSong({ songId: song.id, participantIds: [me.id], mode: 'theme-choice' });
    onResult(r, r.ok ? { body: <span><b>{song.title}</b> queued — grab your partner!</span> } : null);
  }
  function randomPartner() {
    const others = st.participants.filter((p) => p.id !== me.id && p.name);
    const partner = others[Math.floor(Math.random() * others.length)];
    const ids = partner ? [me.id, partner.id] : [me.id];
    const r = Store.chooseSong({ songId: song.id, participantIds: ids, mode: 'theme-choice' });
    onResult(r, r.ok ? { body: <span>Matched with <b>{partner ? partner.name : 'a partner'}</b> for {song.title}!</span> } : null);
  }
  function pool() {
    onClose();
    onResult({ ok: true, goPool: true });
  }
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet accent-violet" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />
        <div style={{ marginBottom: 6 }}><span className="badge badge-duet">Duet</span></div>
        <h2 className="h-lg" style={{ margin: '4px 0 2px' }}>{song.title}</h2>
        <p className="muted" style={{ margin: '0 0 18px', fontSize: 13.5 }}>{song.artist} · How do you want a partner?</p>
        <button className="opt-row" onClick={havePartner}>
          <span className="ic"><Icon name="users" size={20} /></span>
          <span className="tx"><h4>I already have a partner</h4><p>You'll sing together — bring them to the stage</p></span>
        </button>
        <button className="opt-row" onClick={randomPartner}>
          <span className="ic"><Icon name="shuffle" size={20} /></span>
          <span className="tx"><h4>Find me a random partner</h4><p>We'll pair you with another guest right now</p></span>
        </button>
        <button className="opt-row" onClick={pool}>
          <span className="ic"><Icon name="duo" size={20} /></span>
          <span className="tx"><h4>Put me in the duet pool</h4><p>Wait to be matched via Dynamic Duets</p></span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { PhoneHead, Toast, NameScreen, HubScreen, ThemesScreen, ThemeSongs, DuetSheet });
