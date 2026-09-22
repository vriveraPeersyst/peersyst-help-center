import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { IssueHeader, RelatedPages } from '@/components/issue';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const brand = page.slugs[0];
  const related = (page.data.related ?? [])
    .map((slug) => source.getPage([brand, ...slug.split('/')]))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {page.data.kind === 'issue' && (
        <IssueHeader
          symptoms={page.data.symptoms ?? []}
          resolution={page.data.resolution}
          collect={page.data.collect ?? []}
          diagnosis={page.data.diagnosis ?? []}
          tracking={page.data.tracking}
        />
      )}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
        {related.length > 0 && (
          <RelatedPages pages={related.map((p) => ({ url: p.url, title: p.data.title, kind: p.data.kind }))} />
        )}
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
