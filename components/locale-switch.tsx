"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("locale");

  const nextLocale = locale === "en" ? "zh" : "en";

  function handleSwitch() {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      onClick={handleSwitch}
      className="flex h-9 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors hover:bg-[var(--border)]"
    >
      {t("switchTo")}
    </button>
  );
}
