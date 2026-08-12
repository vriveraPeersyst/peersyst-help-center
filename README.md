# peersyst-help-center

Multi brand help center for XRP Mobile, NEAR Mobile and Bitcoin Light: written
guides with screenshots, the video tutorials they are the twin of, and the same
content served to a support agent.

## What lives here

```
apps/web              the site (Next.js + Fumadocs, search by Orama)
apps/support-agent    Intercom webhook + agent            (not started)
packages/help-client  the content index as a library      (not started)
packages/mcp          the same index exposed over MCP     (not started)
content/<brand>/      generated guides, never edited here
```

## The content is generated, not written

Guides are not authored in this repo. Each one is a second output of the same
`TutorialDef` that renders the video over in **peersyst-video**, so the steps,
the prose and the screenshots can never drift from the tutorial they document.

From a peersyst-video checkout:

```bash
npm run export:help -- xrp-mobile \
  --out        ../peersyst-help-center/apps/web/content \
  --assets-out ../peersyst-help-center/apps/web/public/help \
  --assets-base /help
```

That writes `<brand>/<id>.mdx` (front matter, one section per step, chapter
timestamps into the video), `<brand>/<id>.meta.json` (the same guide as data,
which is what the search index and the MCP server will read) and one screenshot
per step, pulled straight from the recording.

`--assets-base` is the seam for hosting: `/help` serves the screenshots from
this app while we build, and it becomes the bucket origin once that exists. The
paths under it do not change.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000/docs/xrp-mobile/create-wallet
```

## Brands

Every brand is loaded in one build and the brand is the first segment of the
URL. This is forced by fumadocs-mdx, whose `dir` option must be a string
literal, so it cannot switch on an env var. Narrowing a deploy to a single
brand happens after the loader, not by building different content trees.
