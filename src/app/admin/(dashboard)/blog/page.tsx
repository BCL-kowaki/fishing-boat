import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogList() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-black tracking-[0.05em]">
          ブログ管理
        </h1>
        <Link
          href="/admin/blog/new"
          className="bg-primary text-white px-5 py-2.5 text-sm font-bold tracking-[0.1em] hover:bg-primary-dark transition-colors"
        >
          新規作成
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">まだ記事がありません</p>
          <Link
            href="/admin/blog/new"
            className="inline-block mt-4 text-primary text-sm hover:underline"
          >
            最初の記事を作成 →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-[0.1em]">
                <th className="px-5 py-3">タイトル</th>
                <th className="px-5 py-3 hidden sm:table-cell">タグ</th>
                <th className="px-5 py-3 hidden sm:table-cell">日付</th>
                <th className="px-5 py-3">状態</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4 text-sm font-medium text-black">
                    {post.title}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500 hidden sm:table-cell">
                    {post.tag}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400 hidden sm:table-cell">
                    {post.date}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs px-2 py-1 ${
                        post.published
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {post.published ? "公開" : "下書き"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-xs text-primary hover:underline"
                    >
                      編集
                    </Link>
                    <DeleteButton id={post.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
