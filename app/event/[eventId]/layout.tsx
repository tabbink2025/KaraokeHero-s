import EventShell from '@/components/participant/EventShell';

export default function EventLayout({ children, params }: { children: React.ReactNode; params: { eventId: string } }) {
  return <EventShell eventId={params.eventId}>{children}</EventShell>;
}
