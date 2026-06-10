'use client';
/* Random modes hub */
import Link from 'next/link';
import { useEvent, PhoneHead } from '@/components/participant/EventShell';
import { Icon } from '@/components/ui';

export default function RandomPage() {
  const { eventId, me } = useEvent();
  const base = `/event/${eventId}`;
  return (
    <>
      <PhoneHead title="Home" backHref={base} me={me} />
      <div className="p-scroll">
        <div className="p-pad">
          <div className="eyebrow">Feeling lucky</div>
          <h1 className="h-lg" style={{ margin: '8px 0 18px' }}>Surprise me</h1>
          <div className="hub-actions">
            <Link className="hub-card accent-gold" href={`${base}/random/solo`}>
              <span className="ic"><Icon name="star" /></span>
              <span className="tx"><h3>Solo Star</h3><p>We pick a solo song. You confirm before it&apos;s queued.</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </Link>
            <Link className="hub-card accent-violet" href={`${base}/random/duet`}>
              <span className="ic"><Icon name="duo" /></span>
              <span className="tx"><h3>Dynamic Duets</h3><p>Join the pool. We pair you up and pick a duet.</p></span>
              <span className="arrow"><Icon name="arrow" size={20} /></span>
            </Link>
          </div>
          <div className="card-soft" style={{ marginTop: 18, display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--gold)', marginTop: 1 }}><Icon name="sparkle" size={18} /></span>
            <p className="muted" style={{ margin: 0, fontSize: 12.5, lineHeight: 1.45 }}>Recently played songs are skipped, so you won&apos;t get a repeat of what just happened on stage.</p>
          </div>
        </div>
      </div>
    </>
  );
}
