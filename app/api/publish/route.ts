import { NextResponse } from "next/server";
import { auth } from "@/auth";

const API_BASE =
  process.env.QUICK_PAGES_API_URL || "https://quick-pages.vercel.app";
const API_KEY = process.env.QUICK_PAGES_API_KEY || "";

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

  const endpoint = action === "publish" ? "/api/publish" : "/api/unpublish";

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ slug }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(
      { error: data?.error || "Failed to update publish status" },
      { status: res.status }
    );
  }

  return NextResponse.json(await res.json());
}
