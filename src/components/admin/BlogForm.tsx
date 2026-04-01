"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BlogFormData = {
  title: string;
  slug: string;
  tag: string;
  date: string;
  excerpt: string;
  body: string;
  published: boolean;
};

type Props = {
  initialData?: BlogFormData & { id: string };
};

const TAGS = ["釣果レポート", "タックル紹介", "お知らせ"];

function generateSlug(title: string, date: string): string {
  return `${date}-${title
    .replace(/[^\w\u3000-\u9FFF]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)}`;
}

export default function BlogForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [form, setForm] = useState<BlogFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    tag: initialData?.tag || TAGS[0],
    date: initialData?.date || new Date().toISOString().split("T")[0],
    excerpt: initialData?.excerpt || "",
    body: initialData?.body || "",
    published: initialData?.published || false,
  });
  const [saving, setSaving] = useState(false);

  const update = (key: keyof BlogFormData, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // タイトル変更時にスラグを自動生成（編集時は除く）
      if (key === "title" && !isEdit) {
        next.slug = generateSlug(value as string, next.date);
      }
      if (key === "date" && !isEdit) {
        next.slug = generateSlug(next.title, value as string);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEdit ? `/api/blog/${initialData!.id}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/blog");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[800px] space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 tracking-[0.05em]">
            タイトル
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 tracking-[0.05em]">
            スラグ（URL）
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 text-sm outline-none focus:border-primary transition-colors font-mono text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 tracking-[0.05em]">
            タグ
          </label>
          <select
            value={form.tag}
            onChange={(e) => update("tag", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 tracking-[0.05em]">
            日付
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update("published", e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-gray-600">公開する</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1.5 tracking-[0.05em]">
          抜粋（一覧表示用）
        </label>
        <textarea
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          rows={2}
          className="w-full px-4 py-3 border border-gray-200 text-sm outline-none focus:border-primary transition-colors resize-y"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1.5 tracking-[0.05em]">
          本文（Markdown）
        </label>
        <textarea
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          rows={15}
          className="w-full px-4 py-3 border border-gray-200 text-sm outline-none focus:border-primary transition-colors resize-y font-mono"
          placeholder="## 見出し&#10;&#10;本文をここに入力..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-8 py-3 text-sm font-bold tracking-[0.1em] hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? "保存中..." : isEdit ? "更新する" : "作成する"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 text-sm text-gray-400 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
