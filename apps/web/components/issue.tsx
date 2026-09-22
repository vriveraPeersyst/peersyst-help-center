import Link from 'next/link';
import type { Resolution } from '@/lib/source';

const RESOLUTION_COPY: Record<Resolution, { label: string; hint: string }> = {
  'self-serve': { label: 'You can fix this yourself', hint: 'No need to contact support: the steps below are the whole fix.' },
  agent: { label: 'Support can resolve this in chat', hint: 'Follow the steps below; the support agent can walk you through them.' },
  escalate: { label: 'Needs a human from the team', hint: 'Gather the details listed here and contact support from Settings, then Support.' },
};

/**
 * The block at the top of every issue page: how the problem shows up, who is
 * expected to close it, and what support will ask for. It is the same data the
 * agent feed carries, rendered for a person.
 */
export function IssueHeader(props: {
  symptoms: string[];
  resolution?: Resolution;
  collect: string[];
  diagnosis: string[];
  tracking?: string;
}) {
  const res = props.resolution ? RESOLUTION_COPY[props.resolution] : null;
  return (
    <div className="issue-header not-prose">
      {props.symptoms.length > 0 && (
        <section>
          <h2>How it shows up</h2>
          <ul>
            {props.symptoms.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}
      {res && (
        <section data-resolution={props.resolution}>
          <h2>{res.label}</h2>
          <p>{res.hint}</p>
        </section>
      )}
      {props.diagnosis.length > 0 && (
        <section data-diagnosis>
          <h2>How support confirms it</h2>
          <ol>
            {props.diagnosis.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
      )}
      {props.collect.length > 0 && (
        <section>
          <h2>Have this ready if you contact support</h2>
          <ul>
            {props.collect.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}
      {props.tracking && (
        <p className="issue-tracking">
          Known issue, tracked by the team as <code>{props.tracking}</code>.
        </p>
      )}
    </div>
  );
}

export function RelatedPages(props: { pages: { url: string; title: string; kind: string }[] }) {
  return (
    <section className="related-pages not-prose">
      <h2>Related</h2>
      <ul>
        {props.pages.map((p) => (
          <li key={p.url}>
            <Link href={p.url}>{p.title}</Link>
            <span>{p.kind}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
