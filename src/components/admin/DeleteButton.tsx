"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("この記事を削除しますか？")) return;

    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-600 transition-colors"
    >
      削除
    </button>
  );
}
