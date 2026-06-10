/* app.jsx — shell, surface switcher, overview, mount */
const { useState: appUse } = React;

function PhoneFrame({ inOverview }) {
  return (
    <div className="phone" style={inOverview ? { maxHeight: 'none', height: 800 } : null}>
      <div className="notch" />
      <div className="screen"><ParticipantApp /></div>
    </div>
  );
}

function ScaledBox({ w, h, scale, children }) {
  return (
    <div className="ov-body" style={{ width: w * scale, height: h * scale }}>
      <div className="ov-scalewrap" style={{ width: w, height: h, transform: 'scale(' + scale + ')', display: 'flex' }}>
        {children}
      </div>
    </div>
  );
}

function OvFrame({ caption, pip, w, h, scale, onOpen, children }) {
  return (
    <div className="ov-frame" style={{ width: w * scale }}>
      <button className="cap" onClick={onOpen} style={{ width: '100%', background: 'none', border: 0, borderBottom: '1px solid var(--line-soft)', color: 'var(--text)', cursor: 'pointer' }}>
        <span className="pip" style={{ background: pip }} />{caption}
        <span style={{ marginLeft: 'auto', color: 'var(--text-mut)' }}><Icon name="arrow" size={15} /></span>
      </button>
      <ScaledBox w={w} h={h} scale={scale}>{children}</ScaledBox>
    </div>
  );
}

function Overview({ pick }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 26px' }} className="scrollable">
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
          <OvFrame caption="Big screen · TV" pip="var(--gold)" w={1160} h={652} scale={0.5} onOpen={() => pick('screen')}>
            <ScreenView />
          </OvFrame>
          <OvFrame caption="Participant · phone" pip="var(--pink)" w={414} h={800} scale={0.5} onOpen={() => pick('phone')}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}><PhoneFrame inOverview /></div>
          </OvFrame>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <OvFrame caption="Admin · queue console" pip="var(--teal)" w={1160} h={620} scale={0.5} onOpen={() => pick('admin')}>
            <AdminView />
          </OvFrame>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [surface, setSurface] = appUse(() => localStorage.getItem('kh_surface') || 'overview');
  function pick(s) { setSurface(s); try { localStorage.setItem('kh_surface', s); } catch (e) {} }
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'sparkle' },
    { id: 'phone', label: 'Participant', icon: 'mic' },
    { id: 'screen', label: 'Big screen', icon: 'playT' },
    { id: 'admin', label: 'Admin', icon: 'shield' },
  ];
  return (
    <div className="stage">
      <div className="topbar">
        <Wordmark size="sm" />
        <div className="switcher">
          {tabs.map((t) => (
            <button key={t.id} className={surface === t.id ? 'active' : ''} onClick={() => pick(t.id)}>
              <Icon name={t.icon} size={15} />{t.label}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <div className="hint"><span className="dot" style={{ background: 'var(--easy)' }} /><b>Live prototype</b> — every view shares one queue</div>
      </div>
      <div className="surface-host">
        {surface === 'phone' && <div className="phone-wrap"><PhoneFrame /></div>}
        {surface === 'screen' && <ScreenView />}
        {surface === 'admin' && <AdminView />}
        {surface === 'overview' && <Overview pick={pick} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
