import type { MetadataRoute } from "next";
import { posts, projects } from "#site/content";

const siteUrl = "https://frankhwang.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "zh"];

  const staticPages = locales.flatMap((locale) =>
    ["", "/projects", "/about"].map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }))
  );

  const blogPages = posts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${siteUrl}/${post.lang}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const projectPages = projects.map((project) => ({
    url: `${siteUrl}/${project.lang}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...projectPages];
}
