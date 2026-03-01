import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Post = {
  title: string;
  slug: string;
  date: string;
  description: string;
};

export function PostList({ posts }: { posts: Post[] }) {
  const t = useTranslations("blog");

  if (posts.length === 0) {
    return <p className="text-[var(--muted)]">{t("noPosts")}</p>;
  }

  return (
    <div className="space-y-10">
      {posts.map((post) => (
        <article key={post.slug}>
          <Link href={`/blog/${post.slug}`} className="group block">
            <time className="text-sm text-[var(--muted)]">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h2 className="mt-1 text-xl font-semibold tracking-tight group-hover:text-[var(--link)] transition-colors">
              {post.title}
            </h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              {post.description}
            </p>
          </Link>
        </article>
      ))}
    </div>
  );
}
