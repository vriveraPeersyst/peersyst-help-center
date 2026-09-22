import { entryToMarkdown, kbEntries } from '@/lib/kb';

export const revalidate = false;

export async function GET() {
  const entries = await kbEntries();
  const text = entries.map(entryToMarkdown).join('\n---\n\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
