import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { QuickPages } from "@/components/quick-pages";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools" });
  return {
    title: t("title"),
  };
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "tools" });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("title")}</h1>
      <QuickPages />
    </div>
  );
}
