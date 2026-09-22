import { redirect } from 'next/navigation';
import { BRAND } from '@/lib/source';

export default function Home() {
  redirect(`/docs/${BRAND}`);
}
