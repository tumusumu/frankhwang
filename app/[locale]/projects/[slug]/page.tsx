import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { projects } from "#site/content";
import { MDXContent } from "@/components/mdx-content";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

function getProject(locale: string, slug: string) {
  return projects.find((p) => p.lang === locale && p.slug === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({
    locale: project.lang,
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = getProject(locale, slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(locale, slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <p className="mt-2 text-[var(--muted)] leading-relaxed">
          {project.description}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--link)] hover:underline"
            >
              {t("viewProject")} &rarr;
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {t("sourceCode")}
            </a>
          )}
        </div>
      </header>

      <div className="prose max-w-none leading-[1.8]">
        <MDXContent code={project.body} />
      </div>
    </article>
  );
}
