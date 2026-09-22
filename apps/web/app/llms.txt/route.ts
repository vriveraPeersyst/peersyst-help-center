import { kbEntries } from '@/lib/kb';
import { SITE_URL } from '@/lib/site';

export const revalidate = false;

export async function GET() {
  const entries = await kbEntries();
  const section = (kind: string, title: string) => {
    const rows = entries.filter((e) => e.kind === kind);
    if (!rows.length) return '';
    return [`## ${title}`, '', ...rows.map((e) => `- [${e.title}](${e.url})${e.description ? `: ${e.description}` : ''}`), ''].join('\n');
  };
  const text = [
    '# XRP Mobile Help Center',
    '',
    'Written guides, common issues and FAQ for the XRP Mobile wallet, maintained by Peersyst.',
    `Full text of every page: ${SITE_URL}/llms-full.txt. Structured feed: ${SITE_URL}/api/kb`,
    '',
    section('playbook', 'Support playbook'),
    section('issue', 'Common issues'),
    section('faq', 'FAQ'),
    section('guide', 'Guides'),
  ].join('\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
