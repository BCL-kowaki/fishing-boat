import { notFound } from "next/navigation";
import { getPostById } from "@/lib/blog";
import BlogForm from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPost({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPostById(params.id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-black tracking-[0.05em] mb-8">
        記事を編集
      </h1>
      <BlogForm
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          tag: post.tag,
          date: post.date,
          excerpt: post.excerpt,
          body: post.body,
          published: post.published,
        }}
      />
    </div>
  );
}
