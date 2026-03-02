import { projects as veliteProjects } from "#site/content";
import type { Locale } from "@/i18n/routing";

export type UnifiedProject = {
  title: string;
  slug: string;
  description: string;
  url?: string;
  repo?: string;
  featured: boolean;
  source: "velite" | "quick-pages";
};

type QuickPage = {
  slug: string;
  title: string;
  desc: string;
  date: string;
  published?: boolean;
};

const PAGES_JSON_URL =
  "https://raw.githubusercontent.com/tumusumu/frankhwang/main/public/p/pages.json";

async function getPublishedQuickPages(): Promise<UnifiedProject[]> {
  try {
    const res = await fetch(PAGES_JSON_URL, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const pages: QuickPage[] = await res.json();
    return pages
      .filter((p) => p.published === true)
      .map((p) => ({
        title: p.title,
        slug: p.slug,
        description: p.desc,
        url: `/p/${p.slug}`,
        featured: true,
        source: "quick-pages" as const,
      }));
  } catch {
    return [];
  }
}

export async function getAllProjects(
  locale: Locale
): Promise<UnifiedProject[]> {
  const staticProjects: UnifiedProject[] = veliteProjects
    .filter((p) => p.lang === locale)
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.description,
      url: p.url,
      repo: p.repo,
      featured: p.featured,
      source: "velite" as const,
    }));

  const quickPages = await getPublishedQuickPages();
  return [...staticProjects, ...quickPages];
}

export async function getFeaturedProjects(
  locale: Locale
): Promise<UnifiedProject[]> {
  const all = await getAllProjects(locale);
  return all.filter((p) => p.featured);
}
