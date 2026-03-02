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

const API_BASE =
  process.env.QUICK_PAGES_API_URL || "https://quick-pages.vercel.app";

async function getPublishedQuickPages(): Promise<UnifiedProject[]> {
  try {
    const res = await fetch(`${API_BASE}/api/published`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const pages: QuickPage[] = await res.json();
    return pages.map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.desc,
      url: `${API_BASE}/p/${p.slug}`,
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
