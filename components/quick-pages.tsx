"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";

type Page = {
  slug: string;
  title: string;
  desc: string;
  date: string;
  published?: boolean;
};

type Status = "idle" | "submitting" | "generating" | "completed" | "error";

export function QuickPages() {
  const t = useTranslations("tools");
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [issueNumber, setIssueNumber] = useState<number | null>(null);
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/p/pages.json")
      .then((res) => res.json())
      .then((data) => setPages(data))
      .catch(() => {});
  }, []);

  // Polling effect
  useEffect(() => {
    if (status !== "generating" || !issueNumber) return;

    function poll() {
      fetch(`/api/request/status?issue=${issueNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "completed") {
            setStatus("completed");
            setPageUrl(data.pageUrl || null);
            // Refresh page list
            fetch("/p/pages.json")
              .then((res) => res.json())
              .then((list) => setPages(list))
              .catch(() => {});
          } else if (data.status === "failed") {
            setStatus("error");
            setErrorMsg(t("errorGeneric"));
          }
          // "generating" → keep polling
        })
        .catch(() => {
          // Network error — keep polling, don't fail
        });
    }

    // Initial delay of 3s, then every 5s
    const initialDelay = setTimeout(() => {
      poll();
      timerRef.current = setInterval(poll, 5000);
    }, 3000);

    return () => {
      clearTimeout(initialDelay);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, issueNumber, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim() || status === "submitting") return;

    setStatus("submitting");
    setErrorMsg("");
    setPageUrl(null);

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

      const data = await res.json();
      setIssueNumber(data.issue_number);
      setStatus("generating");
      setIdea("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t("errorGeneric"));
    }
  }

  async function handlePublish(slug: string, action: "publish" | "unpublish") {
    setPublishing(slug);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action }),
      });

      if (!res.ok) throw new Error();

      setPages((prev) =>
        prev.map((p) =>
          p.slug === slug
            ? { ...p, published: action === "publish" }
            : p
        )
      );
    } catch {
      // silently fail — user can retry
    } finally {
      setPublishing(null);
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
            disabled={!idea.trim() || status === "submitting" || status === "generating"}
            className="rounded-lg bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? t("submitting") : t("submit")}
          </button>
        </form>

        {status === "generating" && (
          <div className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)]">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t("statusGenerating")}
          </div>
        )}
        {status === "completed" && (
          <div className="mt-4 space-y-1">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              {t("statusCompleted")}
            </p>
            {pageUrl && (
              <a
                href={pageUrl}
                className="inline-block text-sm text-[var(--link)] hover:underline"
              >
                {t("statusViewPage")}
              </a>
            )}
            <p className="text-xs text-[var(--muted)]">
              {t("statusDeployNote")}
            </p>
          </div>
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
              <div
                key={page.slug}
                className="rounded-lg border border-[var(--border)] p-4 transition-colors hover:border-[var(--muted)]"
              >
                <a
                  href={`/p/${page.slug}`}
                  className="block"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{page.title}</h3>
                    <span className="text-xs text-[var(--muted)]">
                      {page.date}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {page.desc}
                  </p>
                </a>
                <div className="mt-3 flex items-center gap-2">
                  {page.published && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ● {t("publishAsProject")}
                    </span>
                  )}
                  <button
                    onClick={() =>
                      handlePublish(
                        page.slug,
                        page.published ? "unpublish" : "publish"
                      )
                    }
                    disabled={publishing === page.slug}
                    className="ml-auto text-xs text-[var(--link)] hover:underline disabled:opacity-50"
                  >
                    {publishing === page.slug
                      ? "..."
                      : page.published
                        ? t("unpublish")
                        : t("publishAsProject")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
