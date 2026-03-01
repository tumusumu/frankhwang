import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Frank Hwang";
  const description = searchParams.get("description") || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 28,
              color: "#a3a3a3",
              marginTop: 24,
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        )}
        <div
          style={{
            fontSize: 24,
            color: "#737373",
            marginTop: "auto",
          }}
        >
          frankhwang.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
