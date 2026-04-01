import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

  return (
    <div className="pt-[80px]">
      <article className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-white">
        <div className="max-w-[700px] mx-auto">
          {/* Breadcrumb */}
          <div className="text-xs text-muted mb-8 tracking-[0.05em]">
            <Link href="/" className="hover:text-primary transition-colors">
              TOP
            </Link>
            {" / "}
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            {" / "}
            <span className="text-black">{post.title}</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[0.6rem] text-primary tracking-[0.1em] border border-primary/30 px-2 py-0.5">
                {post.tag}
              </span>
              <span className="text-[0.65rem] text-muted tracking-[0.05em]">
                {post.date}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-black tracking-[0.03em] leading-[1.6]">
              {post.title}
            </h1>
          </div>

          {/* Body — TiptapのHTML出力をそのまま表示 */}
          <div
            className="tiptap article-body max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* Back */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="text-sm text-muted hover:text-primary transition-colors tracking-[0.05em]"
            >
              ← 記事一覧に戻る
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
