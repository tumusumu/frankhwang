import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { projects } from "#site/content";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("title"),
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "projects" });
  const localeProjects = projects.filter((p) => p.lang === locale);

  if (localeProjects.length === 0) {
    return <p className="text-[var(--muted)]">{t("noProjects")}</p>;
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("title")}</h1>
      <div className="grid gap-6">
        {localeProjects.map((project) => (
          <div
            key={project.slug}
            className="rounded-lg border border-[var(--border)] p-6 transition-colors hover:border-[var(--muted)]"
          >
            <h2 className="text-xl font-semibold tracking-tight">
              {project.title}
            </h2>
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
              <Link
                href={`/projects/${project.slug}`}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Details &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
