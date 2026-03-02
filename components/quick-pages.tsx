"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

type Page = {
  slug: string;
  title: string;
  desc: string;
  date: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function QuickPages() {
  const t = useTranslations("tools");
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    fetch("/p/pages.json")
      .then((res) => res.json())
      .then((data) => setPages(data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim() || status === "submitting") return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || t("errorGeneric"));
      }

      setStatus("success");
      setIdea("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t("errorGeneric"));
    }
  }

  return (
    <div className="space-y-12">
      {/* Form section */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight">
          {t("quickPagesHeading")}
        </h2>
        <p className="mt-2 text-[var(--muted)] leading-relaxed">
          {t("quickPagesDescription")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <textarea
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              if (status !== "idle" && status !== "submitting")
                setStatus("idle");
            }}
            placeholder={t("inputPlaceholder")}
            rows={4}
            className="w-full resize-none rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 text-sm leading-relaxed placeholder:text-[var(--muted)] focus:border-[var(--muted)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!idea.trim() || status === "submitting"}
            className="rounded-lg bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? t("submitting") : t("submit")}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            {t("successMessage")}
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            {errorMsg}
          </p>
        )}
      </section>

      {/* Generated pages list */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight">
          {t("generatedPages")}
        </h2>
        {pages.length === 0 ? (
          <p className="mt-4 text-[var(--muted)]">{t("noPages")}</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {pages.map((page) => (
              <a
                key={page.slug}
                href={`/p/${page.slug}`}
                className="block rounded-lg border border-[var(--border)] p-4 transition-colors hover:border-[var(--muted)]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{page.title}</h3>
                  <span className="text-xs text-[var(--muted)]">
                    {page.date}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{page.desc}</p>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
