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

  const veliteProjects = projects.filter((p) => p.source !== "quick-pages");
  const quickPages = projects.filter((p) => p.source === "quick-pages");

  return (
    <div className="space-y-8">
      {veliteProjects.map((project) => (
        <article key={`velite-${project.slug}`}>
          <Link href={`/projects/${project.slug}`} className="group block">
            <h3 className="text-lg font-semibold tracking-tight group-hover:text-[var(--link)] transition-colors">
              {project.title}
            </h3>
            <p className="mt-1 text-[var(--muted)] leading-relaxed">
              {project.description}
            </p>
          </Link>
          <div className="mt-2 flex gap-4 text-sm">
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
        </article>
      ))}

      {quickPages.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {quickPages.map((project) => (
            <a
              key={`quick-pages-${project.slug}`}
              href={project.url}
              className="group block"
            >
              <h3 className="mb-3 font-semibold">{project.title}</h3>
              <div
                className="relative rounded-lg border border-[var(--border)] overflow-hidden
                           group-hover:border-[var(--muted)] transition-colors"
                style={{ height: 200, pointerEvents: "none" }}
              >
                <iframe
                  src={`/p/${project.slug}`}
                  sandbox=""
                  loading="lazy"
                  tabIndex={-1}
                  className="absolute top-0 left-0 border-0"
                  style={{
                    width: 1280,
                    height: 800,
                    transform: "scale(0.28)",
                    transformOrigin: "top left",
                  }}
                />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
