import { kbEntries } from '@/lib/kb';

export const revalidate = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get('brand') ?? undefined;
  const kind = searchParams.get('kind') ?? undefined;
  const entries = (await kbEntries(brand)).filter((e) => !kind || e.kind === kind);
  return Response.json(
    { generatedAt: new Date().toISOString(), count: entries.length, entries },
    { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600' } },
  );
}
