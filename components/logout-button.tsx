"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export function LogoutButton() {
  const t = useTranslations("tools");

  return (
    <button
      onClick={() => signOut()}
      className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
    >
      {t("logout")}
    </button>
  );
}
