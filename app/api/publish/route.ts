import { NextResponse } from "next/server";
import { auth } from "@/auth";

const OWNER = "tumusumu";
const REPO = "frankhwang";
const FILE_PATH = "public/p/pages.json";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, action } = (await req.json()) as {
    slug: string;
    action: "publish" | "unpublish";
  };

  if (!slug || !["publish", "unpublish"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Server misconfigured: missing GITHUB_TOKEN" },
      { status: 500 }
    );
  }

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // 1. Get current file content + SHA
  const getRes = await fetch(apiUrl, { headers });
  if (!getRes.ok) {
    return NextResponse.json(
      { error: "Failed to read pages.json from GitHub" },
      { status: 502 }
    );
  }

  const fileData = await getRes.json();
  const sha = fileData.sha;
  const content = Buffer.from(fileData.content, "base64").toString("utf-8");

  // 2. Parse and modify
  const pages = JSON.parse(content) as Array<{
    slug: string;
    title: string;
    desc: string;
    date: string;
    published?: boolean;
  }>;

  const page = pages.find((p) => p.slug === slug);
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  page.published = action === "publish";

  // 3. PUT back with SHA for conflict prevention
  const newContent = Buffer.from(
    JSON.stringify(pages, null, 2) + "\n"
  ).toString("base64");

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `quick-pages: ${action} ${slug}`,
      content: newContent,
      sha,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.text();
    return NextResponse.json(
      { error: `GitHub API error: ${putRes.status}`, details: err },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, slug, published: page.published });
}
