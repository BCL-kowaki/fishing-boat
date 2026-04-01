import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import SectionHeader from "@/components/ui/SectionHeader";

export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  const posts = await getAllPosts(true);

  return (
    <div className="pt-[80px]">
      <section className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-white">
        <div className="max-w-[1130px] mx-auto">
          <SectionHeader
            label="Blog"
            title="船長の航海日誌"
            description="釣行レポート、海況情報、タックル紹介など。"
          />

          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted text-sm">
              記事はまだありません
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-[10px]">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                    <div className="flex items-center justify-center h-full text-muted-light text-xs">
                      サムネイル
                    </div>
                  </div>
                  <div className="pt-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[0.6rem] text-primary tracking-[0.1em] border border-primary/30 px-2 py-0.5">
                        {post.tag}
                      </span>
                      <span className="text-[0.65rem] text-muted-light tracking-[0.05em]">
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-black leading-[1.8] group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
