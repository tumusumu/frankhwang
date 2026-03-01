import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
  };
}

const content = {
  en: {
    heading: "About Me",
    bio: [
      "Hi, I'm Frank — a software engineer who loves building things that matter.",
      "I'm passionate about clean architecture, developer experience, and shipping products that people enjoy using.",
      "When I'm not coding, you can find me reading, exploring new places, or thinking about the intersection of technology and life.",
    ],
    contact: "Get in Touch",
    contactText:
      "Feel free to reach out on GitHub or X (Twitter). I'm always happy to connect.",
  },
  zh: {
    heading: "关于我",
    bio: [
      "你好，我是 Frank — 一名热爱创造有意义事物的软件工程师。",
      "我对整洁架构、开发者体验以及打造让人愉悦的产品充满热情。",
      "不写代码的时候，你可以在阅读、探索新地方或思考技术与生活交汇处找到我。",
    ],
    contact: "联系方式",
    contactText: "欢迎通过 GitHub 或 X（Twitter）联系我，期待与你交流。",
  },
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const c = content[locale] || content.en;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{c.heading}</h1>
      <div className="space-y-4 leading-[1.8] text-[var(--foreground)]">
        {c.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <h2 className="mt-12 mb-4 text-xl font-semibold">{c.contact}</h2>
      <p className="leading-[1.8] text-[var(--muted)]">{c.contactText}</p>
      <div className="mt-4 flex gap-4 text-sm">
        <a
          href="https://github.com/frankhwang"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--link)] hover:underline"
        >
          GitHub
        </a>
        <a
          href="https://x.com/frankhwang"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--link)] hover:underline"
        >
          X (Twitter)
        </a>
      </div>
    </div>
  );
}
