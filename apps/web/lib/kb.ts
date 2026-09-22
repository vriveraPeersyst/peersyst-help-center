import { source } from '@/lib/source';
import { SITE_URL } from '@/lib/site';

/**
 * The knowledge base as data: one entry per page, with the page's own Markdown.
 * This is the seam between the site and the support agent. Intercom's external
 * content sync crawls the HTML pages; anything that can read JSON (an MCP
 * server, a custom Fin action, an internal bot) reads this instead and gets the
 * kind, symptoms and escalation policy without scraping.
 */
export type KbEntry = {
  url: string;
  path: string;
  brand: string;
  kind: string;
  title: string;
  description: string | null;
  symptoms: string[];
  resolution: string | null;
  collect: string[];
  diagnosis: string[];
  related: string[];
  tracking: string | null;
  video: string | null;
  markdown: string;
};

export const kbEntries = async (brand?: string): Promise<KbEntry[]> => {
  const pages = source.getPages().filter((p) => !brand || p.slugs[0] === brand);
  const entries = await Promise.all(
    pages.map(async (page): Promise<KbEntry> => {
      const d = page.data;
      return {
        url: `${SITE_URL}${page.url}`,
        path: page.url,
        brand: page.slugs[0] ?? '',
        kind: d.kind,
        title: d.title,
        description: d.description ?? null,
        symptoms: d.symptoms ?? [],
        resolution: d.resolution ?? null,
        collect: d.collect ?? [],
        diagnosis: d.diagnosis ?? [],
        related: (d.related ?? []).map((r) => `${SITE_URL}/docs/${page.slugs[0]}/${r}`),
        tracking: d.tracking ?? null,
        video: d.video?.src ? `${SITE_URL}${d.video.src}` : null,
        markdown: await d.getText('processed'),
      };
    }),
  );
  const order = { index: 0, playbook: 1, issue: 2, faq: 3, guide: 4 } as Record<string, number>;
  return entries.sort((a, b) => (order[a.kind] ?? 9) - (order[b.kind] ?? 9) || a.title.localeCompare(b.title));
};

/** One page as Markdown with its metadata up top, the unit of /llms-full.txt. */
export const entryToMarkdown = (e: KbEntry): string => {
  const meta = [
    `# ${e.title}`,
    ``,
    `URL: ${e.url}`,
    `Kind: ${e.kind}`,
    e.description ? `Summary: ${e.description}` : null,
    e.resolution ? `Resolution: ${e.resolution}` : null,
    e.symptoms.length ? `Symptoms: ${e.symptoms.join(' | ')}` : null,
    e.diagnosis.length ? `Diagnosis: ${e.diagnosis.map((d, i) => `${i + 1}. ${d}`).join(' ')}` : null,
    e.collect.length ? `Collect before escalating: ${e.collect.join(' | ')}` : null,
    e.related.length ? `Related: ${e.related.join(' ')}` : null,
    e.tracking ? `Tracking: ${e.tracking}` : null,
    e.video ? `Video: ${e.video}` : null,
  ].filter((l): l is string => l !== null);
  // Images and the player mean nothing to a text consumer.
  const body = e.markdown
    .replace(/!\[[^\]]*]\([^)]*\)\n?/g, '')
    .replace(/<video[\s\S]*?<\/video>\n?/g, '')
    .trim();
  return `${meta.join('\n')}\n\n${body}\n`;
};
