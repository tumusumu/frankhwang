import { defineConfig, defineCollection, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s.object({
    title: s.string().max(99),
    slug: s.string(),
    date: s.isodate(),
    description: s.string().max(999),
    tags: s.array(s.string()).default([]),
    lang: s.enum(["en", "zh"]),
    published: s.boolean().default(true),
    tweetable: s.boolean().default(false),
    body: s.mdx(),
  }),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s.object({
    title: s.string().max(99),
    slug: s.string(),
    description: s.string().max(999),
    url: s.string().url().optional(),
    repo: s.string().url().optional(),
    image: s.string().optional(),
    featured: s.boolean().default(false),
    lang: s.enum(["en", "zh"]),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, projects },
});
