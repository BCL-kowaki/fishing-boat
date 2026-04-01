import { prisma } from "./prisma";
import type { BlogPost } from "@prisma/client";

export async function getAllPosts(publishedOnly = false): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { date: "desc" },
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function createPost(data: {
  title: string;
  slug: string;
  tag: string;
  date: string;
  excerpt: string;
  body: string;
  thumbnail: string;
  published: boolean;
}): Promise<BlogPost> {
  return prisma.blogPost.create({ data });
}

export async function updatePost(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    tag: string;
    date: string;
    excerpt: string;
    body: string;
    thumbnail: string;
    published: boolean;
  }>
): Promise<BlogPost> {
  return prisma.blogPost.update({ where: { id }, data });
}

export async function deletePost(id: string): Promise<void> {
  await prisma.blogPost.delete({ where: { id } });
}
