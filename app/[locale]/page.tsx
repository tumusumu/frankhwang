import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PostList } from "@/components/post-list";
import { posts } from "#site/content";
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

  const localePosts = posts
    .filter((post) => post.lang === locale && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <PostList posts={localePosts} />
    </div>
  );
}
