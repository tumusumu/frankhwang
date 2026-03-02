import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Project = {
  title: string;
  slug: string;
  description: string;
  url?: string;
  repo?: string;
  source?: "velite" | "quick-pages";
};

export function ProjectList({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");

  if (projects.length === 0) {
    return <p className="text-[var(--muted)]">{t("noProjects")}</p>;
  }

  return (
    <div className="space-y-8">
      {projects.map((project) => {
        const isExternal = project.source === "quick-pages";

        return (
          <article key={`${project.source ?? "velite"}-${project.slug}`}>
            {isExternal ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <h3 className="text-lg font-semibold tracking-tight group-hover:text-[var(--link)] transition-colors">
                  {project.title}
                </h3>
                <p className="mt-1 text-[var(--muted)] leading-relaxed">
                  {project.description}
                </p>
              </a>
            ) : (
              <Link href={`/projects/${project.slug}`} className="group block">
                <h3 className="text-lg font-semibold tracking-tight group-hover:text-[var(--link)] transition-colors">
                  {project.title}
                </h3>
                <p className="mt-1 text-[var(--muted)] leading-relaxed">
                  {project.description}
                </p>
              </Link>
            )}
            <div className="mt-2 flex gap-4 text-sm">
              {project.url && !isExternal && (
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
          </article>
        );
      })}
    </div>
  );
}
