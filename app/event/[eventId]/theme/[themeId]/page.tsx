'use client';
/* Song selection within a theme */
import { useParams } from 'next/navigation';
import { useEvent, PhoneHead } from '@/components/participant/EventShell';
import { sel } from '@/components/useEvent';
import { Icon, THEME_ICON, TypeBadge, Diff, LangBadge } from '@/components/ui';

export default function ThemeSongsPage() {
  const { themeId } = useParams<{ themeId: string }>();
  const { eventId, state, me, chooseSong } = useEvent();
  const theme = state.themes.find((t) => t.id === themeId);
  if (!theme) return <div className="p-pad empty" style={{ margin: 20 }}>Theme not found.</div>;

  const songs = sel.songsByTheme(state, themeId);
  const mineSongIds = new Set(sel.activeForParticipant(state, me.id).map((q) => q.songId));

  return (
    <>
      <PhoneHead title="Themes" backHref={`/event/${eventId}/themes`} me={me} />
      <div className="p-scroll">
        <div className={'p-pad accent-' + theme.accent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ width: 46, height: 46, borderRadius: 13, display: 'grid', placeItems: 'center', background: 'color-mix(in oklab, var(--acc) 18%, transparent)', color: 'var(--acc)' }}>
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
                  <button className={'choose-btn' + (added ? ' added' : '')} disabled={added} onClick={() => chooseSong(s)}>
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
