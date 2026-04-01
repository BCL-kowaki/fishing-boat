import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default async function AdminDashboard() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1 className="text-2xl font-bold text-black tracking-[0.05em] mb-8">
        ダッシュボード
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/admin/blog"
          className="bg-white border border-gray-200 p-8 hover:border-primary transition-colors group"
        >
          <h2 className="text-lg font-bold text-black mb-2 group-hover:text-primary transition-colors">
            ブログ管理
          </h2>
          <p className="text-sm text-gray-500">
            {posts.length}件の記事
          </p>
        </Link>

        <Link
          href="/admin/calendar"
          className="bg-white border border-gray-200 p-8 hover:border-primary transition-colors group"
        >
          <h2 className="text-lg font-bold text-black mb-2 group-hover:text-primary transition-colors">
            カレンダー管理
          </h2>
          <p className="text-sm text-gray-500">
            出船日の追加・変更
          </p>
        </Link>
      </div>
    </div>
  );
}
