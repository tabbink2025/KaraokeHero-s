/* ui.jsx — shared primitives, icons, hooks */
const { useState, useEffect, useRef, useCallback } = React;

/* ---- live store hook ---- */
function useStore() {
  const [, force] = useState(0);
  useEffect(() => Store.subscribe(() => force((n) => n + 1)), []);
  return Store.getState();
}

/* ---- icons (simple geometric, currentColor) ---- */
function Icon({ name, size = 22, sw = 1.8 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    ball: <g><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17M3.5 12h17M5.7 5.7l12.6 12.6M18.3 5.7L5.7 18.3" strokeWidth="1" opacity="0.6" /></g>,
    heart: <path d="M12 20s-7-4.6-9-9.2C1.6 7.3 3.5 4.5 6.6 4.5 8.6 4.5 10 5.7 12 8c2-2.3 3.4-3.5 5.4-3.5 3.1 0 5 2.8 3.6 6.3C19 15.4 12 20 12 20Z" />,
    bolt: <path d="M13.5 2 5 13.5h6L10.5 22 19 10.5h-6L13.5 2Z" />,
    diamond: <path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z" />,
    duo: <g><circle cx="8.5" cy="9" r="3" /><circle cx="15.5" cy="9" r="3" /><path d="M3.5 19c.6-2.7 2.6-4 5-4M21.5 19c-.6-2.7-2.6-4-5-4M9.5 19c.4-1.6 1.4-2.4 2.5-2.4S14 17.4 14.5 19" /></g>,
    play: <path d="M8 5.5v13l11-6.5L8 5.5Z" />,
    mic: <g><rect x="9" y="2.5" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" /></g>,
    dice: <g><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" /><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /></g>,
    list: <path d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
    check: <path d="M4 12.5 9.5 18 20 6.5" />,
    plus: <path d="M12 5v14M5 12h14" />,
    x: <path d="M6 6l12 12M18 6 6 18" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    chevL: <path d="M15 5l-7 7 7 7" />,
    chevU: <path d="M6 15l6-6 6 6" />,
    chevD: <path d="M6 9l6 6 6-6" />,
    playT: <path d="M7 5v14l12-7L7 5Z" fill="currentColor" stroke="none" />,
    pause: <g><rect x="7" y="5" width="3.5" height="14" rx="1.2" fill="currentColor" stroke="none" /><rect x="13.5" y="5" width="3.5" height="14" rx="1.2" fill="currentColor" stroke="none" /></g>,
    skip: <g><path d="M6 5v14l10-7L6 5Z" fill="currentColor" stroke="none" /><rect x="17" y="5" width="2.5" height="14" rx="1" fill="currentColor" stroke="none" /></g>,
    users: <g><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c.7-3 3-4.5 5.5-4.5S13.8 16 14.5 19" /><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.6c2 .6 3.4 2.1 4 4.4" /></g>,
    shuffle: <path d="M3 7h3.5c1.5 0 2.4.9 3.4 2.3M3 17h3.5c2.4 0 3.6-2.4 5-4.6C13 10 14.2 7 16.5 7H21M17.5 3.5 21 7l-3.5 3.5M17.5 13.5 21 17l-3.5 3.5" />,
    sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />,
    qr: <g><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><path d="M13.5 14h2.5v2.5M20.5 13.5v3M16 20.5h4.5M13.5 18.5v2" /></g>,
    trash: <path d="M4 6.5h16M9 6.5V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 6.5 7 20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13.5" />,
    clock: <g><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></g>,
    shield: <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />,
    flag: <path d="M5 21V4M5 4h11l-1.5 3.5L16 11H5" />,
    globe: <g><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" /></g>,
    star: <path d="M12 3l2.6 5.6L21 9.3l-4.5 4.3 1.1 6.2L12 17l-5.6 2.8 1.1-6.2L3 9.3l6.4-.7L12 3Z" />,
    pencil: <path d="M4 20.5h4L19.5 9 15.5 5 4 16.5v4ZM14 6.5l4 4" />,
  };
  return <svg {...p}>{paths[name] || null}</svg>;
}

const THEME_ICON = { party: 'ball', guilty: 'heart', rock: 'bolt', nl: 'diamond', duet: 'duo', movie: 'play' };

/* ---- wordmark ---- */
function Wordmark({ size = 'md' }) {
  return (
    <span className={'wordmark sz-' + size}>
      <span className="disc" />
      <span className="name">Karaoke<b>Hero's</b></span>
    </span>
  );
}

/* ---- small bits ---- */
function avaClass(id) {
  const map = { part_lobby: 'a2', part_marco: 'a3', part_emma: 'a4', part_jules: 'a5' };
  if (map[id]) return map[id];
  let h = 0; for (let i = 0; i < (id || '').length; i++) h = (h * 31 + id.charCodeAt(i)) % 6;
  return 'a' + (h + 1);
}
function Avatar({ id, name }) {
  const nm = name || Store.sel.partName(id);
  return <span className={'ava ' + avaClass(id)}>{(nm || '?').slice(0, 1).toUpperCase()}</span>;
}
function AvaStack({ ids }) {
  return <span className="ava-stack">{ids.map((id) => <Avatar key={id} id={id} />)}</span>;
}
function Diff({ d }) {
  return <span className="diff" data-d={d}><span className="bars"><i /><i /><i /></span>{d}</span>;
}
function TypeBadge({ type }) {
  return <span className={'badge ' + (type === 'duet' ? 'badge-duet' : 'badge-solo')}>{type === 'duet' ? 'Duet' : 'Solo'}</span>;
}
function LangBadge({ lang }) {
  return <span className="badge badge-line">{lang}</span>;
}
function singerNames(ids) {
  return ids.map((id) => Store.sel.partName(id)).join(' & ');
}

Object.assign(window, {
  useStore, Icon, THEME_ICON, Wordmark, Avatar, AvaStack, Diff, TypeBadge, LangBadge, singerNames, avaClass,
});
