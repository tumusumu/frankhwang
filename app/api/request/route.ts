import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting (best-effort on serverless)
const rateMap = new Map<string, { start: number; count: number }>();
const RATE_LIMIT = 3; // max requests
const RATE_WINDOW = 60_000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW) {
    rateMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const idea = body?.idea;
  if (!idea || !idea.trim()) {
    return NextResponse.json({ error: "请输入页面需求" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Server misconfigured: missing GITHUB_TOKEN" },
      { status: 500 }
    );
  }

  const repo = process.env.GITHUB_REPO || "tumusumu/frankhwang";

  const title =
    idea.trim().length > 80 ? idea.trim().slice(0, 77) + "..." : idea.trim();

  const issueBody = `## 页面需求\n\n${idea.trim()}\n\n---\n_自动提交自 Quick Pages_`;

  const response = await fetch(
    `https://api.github.com/repos/${repo}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "quick-pages-bot",
      },
      body: JSON.stringify({
        title,
        body: issueBody,
        labels: ["page-request"],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("GitHub API error:", err);
    return NextResponse.json(
      { error: "创建请求失败，请稍后重试" },
      { status: 500 }
    );
  }

  const issue = await response.json();
  return NextResponse.json({
    success: true,
    issue_number: issue.number,
    issue_url: issue.html_url,
    message: "需求已提交，页面正在自动生成中...",
  });
}
