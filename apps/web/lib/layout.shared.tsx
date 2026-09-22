import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <span
            aria-hidden
            className="inline-block size-5 rounded-md"
            style={{ background: 'linear-gradient(135deg, #03DD7E, #1FB6FF)' }}
          />
          XRP Mobile Help
        </span>
      ),
      url: '/docs/xrp-mobile',
    },
    links: [
      { text: 'Guides', url: '/docs/xrp-mobile' },
      { text: 'Common issues', url: '/docs/xrp-mobile/issues' },
      { text: 'FAQ', url: '/docs/xrp-mobile/faq' },
    ],
  };
}
