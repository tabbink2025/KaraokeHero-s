'use client';
/* Theme selection */
import Link from 'next/link';
import { useEvent, PhoneHead } from '@/components/participant/EventShell';
import { sel } from '@/components/useEvent';
import { Icon, THEME_ICON } from '@/components/ui';

export default function ThemesPage() {
  const { eventId, state, me } = useEvent();
  return (
    <>
      <PhoneHead title="Home" backHref={`/event/${eventId}`} me={me} />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow">Choose a room</div>
          <h1 className="h-lg" style={{ margin: '8px 0 18px' }}>Themes</h1>
          <div className="theme-grid">
            {state.themes.map((t) => (
              <Link key={t.id} className={'theme-card accent-' + t.accent} href={`/event/${eventId}/theme/${t.id}`}>
                <span className="ic"><Icon name={THEME_ICON[t.id]} size={22} /></span>
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                </div>
                <span className="cnt">{sel.songsByTheme(state, t.id).length} songs</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
