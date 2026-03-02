"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export function LoginButton() {
  const t = useTranslations("tools");

  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/tools" })}
      className="rounded-lg bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90"
    >
      {t("loginWithGitHub")}
    </button>
  );
}
