import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Articles | Synth Cohost',
  description:
    'Press coverage and publications featuring Synth Cohost — the AI cohost for live streamers.',
};

/* ------------------------------------------------------------------ *
 * THE ARTICLE LIST — this is the only part you need to edit.
 *
 * These are external publications that have featured Synth Cohost, so each
 * one links out to the publisher's own site.
 *
 * To add an article, copy one block and fill it in. Keep the commas.
 * Newest first reads best.
 *
 *   {
 *     title: 'Headline of the article',
 *     publication: 'Where it was published',
 *     date: 'August 2026',              // shown as written; any format is fine
 *     url: 'https://example.com/story', // the full link, including https://
 *     excerpt: 'One or two lines about the piece.',  // optional, may be removed
 *   },
 *
 * Delete the placeholder comment below once the first real one is added.
 * The page shows a "coming soon" state on its own whenever the list is empty,
 * so it is safe to leave it as it is until then.
 * ------------------------------------------------------------------ */

interface Article {
  title: string;
  publication: string;
  date: string;
  url: string;
  excerpt?: string;
}

const ARTICLES: Article[] = [
  // Articles below — add them here as they are published.
];

/** Arrow that leans out on hover, marking a link that leaves the site. */
function ExternalArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path
        d="M4 12L12 4M12 4H6M12 4v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#0d0b14] flex flex-col">
      <Navbar />

      <section className="relative flex-1 px-6 lg:px-20 pt-32 pb-20 max-w-5xl mx-auto w-full">
        <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#7c3aed]">
          Press &amp; Features
        </span>

        <h1 className="mt-4 text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-1px] text-[#f5f3ff]">
          Articles
        </h1>

        <p className="mt-4 max-w-2xl text-[16px] leading-[1.7] text-[#a09bbf]">
          Publications and coverage featuring Synth Cohost. Each link opens the
          article on the publisher&apos;s own site.
        </p>

        <div className="mt-10 h-px w-full bg-[rgba(255,255,255,0.07)]" />

        {ARTICLES.length === 0 ? (
          /* Stands in until the first article is published. Nothing here needs
             editing — it disappears by itself once the list above has an entry. */
          <div className="mt-10 rounded-2xl border border-dashed border-[rgba(255,255,255,0.12)] bg-[#13111e] px-6 py-14 text-center">
            <p className="text-[18px] font-semibold text-[#f5f3ff]">
              Articles below
            </p>
            <p className="mt-2 text-[14px] text-[#a09bbf]">
              Coverage is on the way. This list fills in as pieces are
              published.
            </p>
          </div>
        ) : (
          <ul className="mt-10 flex flex-col gap-4">
            {ARTICLES.map((article) => (
              <li key={article.url}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-3 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#13111e] px-6 py-6 transition-colors hover:border-[rgba(124,58,237,0.5)] hover:bg-[#171429]"
                >
                  <div className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[1.4px] text-[#7c3aed]">
                    <span>{article.publication}</span>
                    <span className="text-[rgba(255,255,255,0.2)]">•</span>
                    <span className="text-[#a09bbf]">{article.date}</span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-[20px] lg:text-[22px] font-bold leading-[1.3] text-[#f5f3ff]">
                      {article.title}
                    </h2>
                    <span className="mt-1 text-[#a09bbf] transition-colors group-hover:text-[#b58af7]">
                      <ExternalArrow />
                    </span>
                  </div>

                  {article.excerpt && (
                    <p className="text-[15px] leading-[1.6] text-[#a09bbf]">
                      {article.excerpt}
                    </p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </main>
  );
}
