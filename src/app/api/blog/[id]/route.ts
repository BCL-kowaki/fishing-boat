import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getPostById, updatePost, deletePost } from "@/lib/blog";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await getPostById(params.id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const post = await updatePost(params.id, data);
  return NextResponse.json(post);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deletePost(params.id);
  return NextResponse.json({ success: true });
}
