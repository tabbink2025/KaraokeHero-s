/* admin.jsx — queue management console */
const { useState: aUse } = React;

function EventNameEditor() {
  const st = useStore();
  const [editing, setEditing] = aUse(false);
  const [v, setV] = aUse(st.event.name);
  function commit() { Store.setEventName(v); setEditing(false); }
  if (editing) {
    return (
      <input autoFocus value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setV(st.event.name); setEditing(false); } }}
        style={{ background: 'var(--surface)', border: '1px solid var(--gold)', borderRadius: 8, padding: '5px 10px', color: 'var(--text)', fontSize: 12.5, fontWeight: 700, width: 168 }} />
    );
  }
  return (
    <button onClick={() => { setV(st.event.name); setEditing(true); }} title="Rename event"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 0, color: 'var(--text-dim)', fontSize: 12.5, fontWeight: 700 }}>
      {st.event.name}<span style={{ color: 'var(--text-mut)' }}><Icon name="pencil" size={13} /></span>
    </button>
  );
}

function AdminView() {
  const st = useStore();
  const current = Store.sel.current();
  const upcoming = Store.sel.upcoming();
  const playing = st.playback.isPlaying;
  const curSong = current ? Store.sel.songById(current.songId) : null;

  return (
    <div className="admin">
      {/* main */}
      <div className="admin-main scrollable">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Wordmark size="sm" />
            <span className="badge badge-soft">Admin</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="muted" style={{ fontSize: 12.5 }}>Event:</span><EventNameEditor /></span>
        </div>

        {/* now playing */}
        <p className="sec-title"><Icon name="playT" size={13} /> Current song</p>
        {current ? (
          <div className="now-card">
            <div className="row1">
              <AvaStack ids={current.participantIds} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="lab">{playing ? '● On stage now' : 'Loaded — not started'}</div>
                <div className="t">{curSong.title}</div>
                <div className="a">{curSong.artist}</div>
                <div className="singers"><Icon name="mic" size={15} /> {singerNames(current.participantIds)} · <TypeBadge type={curSong.type} /></div>
              </div>
            </div>
            <div className="controls">
              {playing
                ? <button className="ctrl warn" onClick={() => Store.pause()}><Icon name="pause" size={16} /> Pause</button>
                : <button className="ctrl primary" onClick={() => Store.resume()}><Icon name="playT" size={16} /> Start current song</button>}
              <button className="ctrl" onClick={() => Store.skip(current.id)}><Icon name="skip" size={16} /> Skip</button>
              <button className="ctrl done" onClick={() => Store.markDone(current.id)}><Icon name="check" size={16} /> Mark as done</button>
            </div>
          </div>
        ) : (
          <div className="now-card" style={{ textAlign: 'center' }}>
            <p className="muted" style={{ margin: '4px 0 14px' }}>Nothing playing.</p>
            <button className="ctrl primary" disabled={upcoming.length === 0} onClick={() => upcoming[0] && Store.playItem(upcoming[0].id)} style={{ margin: '0 auto' }}>
              <Icon name="playT" size={16} /> Start next song
            </button>
          </div>
        )}

        {/* queue */}
        <p className="sec-title" style={{ marginTop: 24 }}><Icon name="list" size={13} /> Queue · {upcoming.length}</p>
        {upcoming.length === 0
          ? <div className="empty">No songs queued. Guests can add from their phones.</div>
          : upcoming.map((it, i) => {
            const s = Store.sel.songById(it.songId);
            return (
              <div className="q-item" key={it.id}>
                <span className="pos">{i + 1}</span>
                <span className="ava-stack" style={{ flex: 'none' }}><AvaStack ids={it.participantIds} /></span>
                <div className="info">
                  <div className="t">{s.title}</div>
                  <div className="sub">
                    {singerNames(it.participantIds)}
                    {it.mode === 'dynamic-duet' && <span className="badge badge-duet">Dyn. duet</span>}
                    {it.mode === 'solo-star' && <span className="badge badge-line">Solo star</span>}
                    <span className="diff" data-d={s.difficulty}><span className="bars"><i /><i /><i /></span></span>
                  </div>
                </div>
                <div className="moves">
                  <button disabled={i === 0} onClick={() => Store.moveItem(it.id, -1)}><Icon name="chevU" size={13} /></button>
                  <button disabled={i === upcoming.length - 1} onClick={() => Store.moveItem(it.id, 1)}><Icon name="chevD" size={13} /></button>
                </div>
                <div className="actions">
                  <button className="iconbtn" title="Play now" onClick={() => Store.playItem(it.id)}><Icon name="playT" size={15} /></button>
                  <button className="iconbtn danger" title="Remove" onClick={() => Store.removeItem(it.id)}><Icon name="trash" size={15} /></button>
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
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{st.moderation ? 'On — you keep control of the list' : 'Off — songs go straight in'}</div>
          </div>
          <button className={'toggle' + (st.moderation ? ' on' : '')} onClick={() => Store.toggleModeration()}>
            <span className="track"><span className="knob" /></span>
          </button>
        </div>

        <div className="divider" />
        <p className="sec-title"><Icon name="duo" size={13} /> Duet pool · {st.duetPool.length}</p>
        {st.duetPool.length === 0
          ? <div className="empty" style={{ padding: '16px 12px' }}>Pool is empty</div>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {st.duetPool.map((e) => <span className="pool-chip" key={e.id}><Avatar id={e.participantId} /> {Store.sel.partName(e.participantId)}</span>)}
            </div>}

        <div className="divider" />
        <p className="sec-title"><Icon name="users" size={13} /> Guests · {st.participants.filter(p => p.name).length}</p>
        <div className="plist">
          {st.participants.filter(p => p.name).map((p) => {
            const n = Store.sel.activeForParticipant(p.id).length;
            return (
              <div className="prow" key={p.id}>
                <Avatar id={p.id} name={p.name} />
                <span className="nm">{p.name}{p.id === st.me.id ? ' (you)' : ''}</span>
                <span className="ct">{n} queued</span>
              </div>
            );
          })}
        </div>

        <div className="divider" />
        <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => { localStorage.removeItem('kh_screen_started'); Store.resetAll(); }}>
          <Icon name="shuffle" size={15} /> Reset demo data
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { AdminView });
