import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Twitter API not implemented yet." },
    { status: 501 }
  );
}
