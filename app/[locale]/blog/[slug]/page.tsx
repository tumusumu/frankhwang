import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-content";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

function getPost(locale: string, slug: string) {
  return posts.find(
    (post) => post.lang === locale && post.slug === slug && post.published
  );
}

function getAdjacentPosts(locale: string, slug: string) {
  const localePosts = posts
    .filter((post) => post.lang === locale && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const index = localePosts.findIndex((post) => post.slug === slug);
  return {
    prev: index < localePosts.length - 1 ? localePosts[index + 1] : null,
    next: index > 0 ? localePosts[index - 1] : null,
  };
}

export function generateStaticParams() {
  return posts
    .filter((post) => post.published)
    .map((post) => ({
      locale: post.lang,
      slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      images: [
        {
          url: `/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const { prev, next } = getAdjacentPosts(locale, slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Frank Hwang",
      url: "https://frankhwang.com",
    },
    url: `https://frankhwang.com/${locale}/blog/${post.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // SAFE: JSON.stringify auto-escapes all values; data is from Velite build output
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-8">
        <time className="text-sm text-[var(--muted)]">
          {new Date(post.date).toLocaleDateString(
            locale === "zh" ? "zh-CN" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </time>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose max-w-none leading-[1.8]">
        <MDXContent code={post.body} />
      </div>

      <nav className="mt-16 flex items-center justify-between border-t border-[var(--border)] pt-6 text-sm">
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            &larr; {t("prev")}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            {t("next")}: {next.title} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
