import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogPosts, fetchPostBySlug, STATIC_BLOG_SLUGS } from '@/lib/wp-posts';

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await fetchBlogPosts();
  // Only generate params for WP-sourced posts — static pages handle their own slugs
  return posts
    .filter((p) => p.fromWP && !STATIC_BLOG_SLUGS.has(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = await fetchPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt
      ? post.excerpt.replace(/<[^>]+>/g, '').slice(0, 160)
      : undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      url: `/blog/${post.slug}`,
    },
  };
}

export default async function WPBlogPostPage({ params }) {
  // If this slug belongs to a hardcoded static page, don't render here
  if (STATIC_BLOG_SLUGS.has(params.slug)) notFound();

  const post = await fetchPostBySlug(params.slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: { '@type': 'Person', name: 'D.C. Barletta' },
    datePublished: post.date ?? undefined,
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-14 md:py-20 text-[#2a1f17]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#6f4f38] hover:text-[#3a2617]"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Field Notes
      </Link>

      <article className="rounded-3xl border border-amber-900/30 bg-[linear-gradient(145deg,#fbf6ee,#e9dac5)] p-8 shadow-[0_20px_46px_rgba(35,20,8,0.14)] md:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Field Notes</p>
        <h1 className="mt-3 text-3xl font-tethys-volcanic text-[#2f1f14] md:text-4xl">{post.title}</h1>

        {post.content && (
          <div
            className="prose-tethys mt-6 text-[#3a2617]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </article>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/blog"
          className="rounded-full border border-amber-900/25 bg-[#f8f2e8]/95 px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3a2617] transition hover:-translate-y-0.5 hover:bg-[#fff8ef]"
        >
          All Field Notes
        </Link>
        <Link
          href="/world-of-tethys-book-1"
          className="rounded-full border border-[#6d4c36] bg-[#2f2219] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#f7eee2] transition hover:-translate-y-0.5 hover:bg-[#20160f]"
        >
          Book One
        </Link>
      </div>
    </main>
  );
}
// World of Tethys || D.C. Barletta
