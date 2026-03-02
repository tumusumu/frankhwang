import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PostList } from "@/components/post-list";
import { ProjectList } from "@/components/project-list";
import { posts, projects } from "#site/content";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  const localePosts = posts
    .filter((post) => post.lang === locale && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredProjects = projects.filter(
    (project) => project.lang === locale && project.featured
  );

  return (
    <div className="space-y-16">
      <section>
        <h2 className="mb-8 text-2xl font-bold tracking-tight">
          {t("latestPosts")}
        </h2>
        <PostList posts={localePosts} />
      </section>

      {featuredProjects.length > 0 && (
        <section>
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            {t("featuredProjects")}
          </h2>
          <ProjectList projects={featuredProjects} />
        </section>
      )}
    </div>
  );
}
