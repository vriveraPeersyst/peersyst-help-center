import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';

/**
 * One site, many brands: the brand is chosen at build time, so each brand gets
 * its own deploy off the same code and its own content tree. Guides under
 * `content/<brand>/` are written by `npm run export:help` over in peersyst-video
 * and are never edited here by hand.
 */
export const BRAND = process.env.NEXT_PUBLIC_BRAND ?? 'xrp-mobile';

// `dir` has to be a string literal: the macro uses it to decide what gets
// bundled, so it cannot depend on an env var. Every brand is therefore loaded in
// one build and the brand is the first segment of the URL. Filtering down to a
// single brand per deploy happens after the loader, not here.
const docs = defineDocs({
  dir: 'content',
});

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
