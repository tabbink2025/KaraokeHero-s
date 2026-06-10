import { redirect } from 'next/navigation';
import { DEFAULT_EVENT } from '@/lib/seed';

export default function Home() {
  redirect('/event/' + DEFAULT_EVENT.id);
}
