import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { QuickPages } from "@/components/quick-pages";
import { LoginButton } from "@/components/login-button";
import { LogoutButton } from "@/components/logout-button";
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
  const session = await auth();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("title")}</h1>

      {session ? (
        <>
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">
              {session.user?.name}
            </p>
            <LogoutButton />
          </div>
          <QuickPages />
        </>
      ) : (
        <div className="rounded-lg border border-[var(--border)] p-8 text-center">
          <p className="mb-4 text-[var(--muted)]">{t("loginRequired")}</p>
          <LoginButton />
        </div>
      )}
    </div>
  );
}
