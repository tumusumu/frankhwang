import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  const issueParam = request.nextUrl.searchParams.get("issue");

  if (!issueParam || !/^\d+$/.test(issueParam)) {
    return NextResponse.json(
      { error: "Invalid issue number" },
      { status: 400 }
    );
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const repo = process.env.GITHUB_REPO || "tumusumu/frankhwang";
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "quick-pages-bot",
  };

  // Fetch issue details
  const issueRes = await fetch(
    `https://api.github.com/repos/${repo}/issues/${issueParam}`,
    { headers }
  );

  if (!issueRes.ok) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const issue = await issueRes.json();

  // Security: only allow querying issues with page-request label
  const hasLabel = issue.labels?.some(
    (l: { name: string }) => l.name === "page-request"
  );
  if (!hasLabel) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  // Issue closed → check comments for page URL
  if (issue.state === "closed") {
    const commentsRes = await fetch(issue.comments_url, { headers });
    if (commentsRes.ok) {
      const comments = await commentsRes.json();
      for (const comment of comments) {
        const match = comment.body?.match(/\/p\/([a-zA-Z0-9_-]+)/);
        if (match) {
          return NextResponse.json({
            status: "completed",
            pageUrl: `/p/${match[1]}`,
          });
        }
      }
    }
    // Closed but no URL found — treat as completed anyway
    return NextResponse.json({ status: "completed" });
  }

  // Issue open → check for failure comment or timeout
  const commentsRes = await fetch(issue.comments_url, { headers });
  if (commentsRes.ok) {
    const comments = await commentsRes.json();
    for (const comment of comments) {
      if (comment.body?.includes("❌")) {
        return NextResponse.json({ status: "failed" });
      }
    }
  }

  // Check timeout
  const createdAt = new Date(issue.created_at).getTime();
  if (Date.now() - createdAt > TIMEOUT_MS) {
    return NextResponse.json({ status: "failed" });
  }

  return NextResponse.json({ status: "generating" });
}
