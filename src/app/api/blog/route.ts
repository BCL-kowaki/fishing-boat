import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getAllPosts, createPost } from "@/lib/blog";

export async function GET(request: NextRequest) {
  const publishedOnly = request.nextUrl.searchParams.get("published") === "true";
  const posts = await getAllPosts(publishedOnly);
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const post = await createPost(data);
  return NextResponse.json(post, { status: 201 });
}
