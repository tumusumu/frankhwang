import { Feed } from "feed";
import { posts } from "#site/content";

const siteUrl = "https://frankhwang.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en";

  const feed = new Feed({
    title: lang === "zh" ? "Frank Hwang 的博客" : "Frank Hwang's Blog",
    description:
      lang === "zh"
        ? "关于软件、技术与生活的思考。"
        : "Thoughts on software, technology, and life.",
    id: siteUrl,
    link: siteUrl,
    language: lang,
    copyright: `All rights reserved ${new Date().getFullYear()}, Frank Hwang`,
    author: {
      name: "Frank Hwang",
      link: siteUrl,
    },
  });

  const localePosts = posts
    .filter((post) => post.lang === lang && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (const post of localePosts) {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/${lang}/blog/${post.slug}`,
      link: `${siteUrl}/${lang}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
