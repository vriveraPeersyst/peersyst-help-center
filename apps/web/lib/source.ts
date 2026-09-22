import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';
import { z } from 'zod';

/**
 * One site, many brands: the brand is the first segment of the URL. Guides
 * under `content/<brand>/` are written by `npm run export:help` over in
 * peersyst-video and are never edited here by hand; the `issues/` and `faq/`
 * folders next to them are authored here.
 */
export const BRAND = process.env.NEXT_PUBLIC_BRAND ?? 'xrp-mobile';

/** What a page is, which decides how it renders and how the agent feed labels it. */
export const PAGE_KINDS = ['guide', 'issue', 'faq', 'playbook', 'index'] as const;
export type PageKind = (typeof PAGE_KINDS)[number];

/**
 * Who is expected to close an issue. The support agent reads this from the
 * knowledge feed: `self-serve` it answers on its own, `agent` it can walk the
 * user through but must confirm the outcome, `escalate` it collects the listed
 * details and hands over to a human.
 */
export const RESOLUTIONS = ['self-serve', 'agent', 'escalate'] as const;
export type Resolution = (typeof RESOLUTIONS)[number];

export const frontmatter = pageSchema.extend({
  kind: z.enum(PAGE_KINDS).default('guide'),
  brand: z.string().optional(),
  /** Generated guides: the tutorial id they were exported from. */
  feature: z.string().optional(),
  video: z
    .object({
      src: z.string().nullable(),
      poster: z.string().nullable(),
      durationSec: z.number(),
    })
    .optional(),
  chapters: z.array(z.object({ step: z.number(), atSec: z.number(), label: z.string() })).optional(),
  /** Issues: how the user describes it, in their words. Drives search and the agent's matching. */
  symptoms: z.array(z.string()).optional(),
  resolution: z.enum(RESOLUTIONS).optional(),
  /** Issues: what to ask the user for before escalating. */
  collect: z.array(z.string()).optional(),
  /**
   * Issues: how support confirms the cause before answering, in order. Mostly
   * explorer lookups. This is the part of the page written for the agent.
   */
  diagnosis: z.array(z.string()).optional(),
  /** Slugs of related pages within the same brand (e.g. "receive", "issues/wrong-network"). */
  related: z.array(z.string()).optional(),
  /** Open tracker reference when the issue is a known bug or limitation. */
  tracking: z.string().optional(),
});

// `dir` has to be a string literal: the macro uses it to decide what gets
// bundled, so it cannot depend on an env var. Every brand is therefore loaded in
// one build. The meta pattern is narrowed to meta.json because the exporter also
// drops `index.json` and `<id>.meta.json` next to the guides, and those are
// data for the agent feed, not sidebar configuration.
const docs = defineDocs({
  dir: 'content',
  docs: {
    schema: frontmatter,
    // Plain Markdown of every page, for /llms-full.txt and /api/kb: what the
    // support agent actually ingests.
    postprocess: { includeProcessedMarkdown: true },
  },
  meta: {
    files: ['**/meta.json'],
  },
});

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
