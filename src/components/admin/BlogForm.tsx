"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type BlogFormData = {
  title: string;
  slug: string;
  tag: string;
  date: string;
  excerpt: string;
  body: string;
  thumbnail: string;
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

/* ── ツールバーボタン ── */
type ToolAction = {
  label: string;
  icon: string;
  prefix: string;
  suffix: string;
  block?: boolean;
};

const TOOLS: ToolAction[] = [
  { label: "見出し2", icon: "H2", prefix: "## ", suffix: "", block: true },
  { label: "見出し3", icon: "H3", prefix: "### ", suffix: "", block: true },
  { label: "太字", icon: "B", prefix: "**", suffix: "**" },
  { label: "リスト", icon: "・", prefix: "- ", suffix: "", block: true },
  { label: "番号リスト", icon: "1.", prefix: "1. ", suffix: "", block: true },
  { label: "リンク", icon: "🔗", prefix: "[", suffix: "](URL)" },
  { label: "区切り線", icon: "─", prefix: "\n---\n", suffix: "", block: true },
];

export default function BlogForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState<BlogFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    tag: initialData?.tag || TAGS[0],
    date: initialData?.date || new Date().toISOString().split("T")[0],
    excerpt: initialData?.excerpt || "",
    body: initialData?.body || "",
    thumbnail: initialData?.thumbnail || "",
    published: initialData?.published || false,
  });
  const [saving, setSaving] = useState(false);
  const [editorMode, setEditorMode] = useState<"editor" | "code">("editor");
  const [uploading, setUploading] = useState(false);

  const update = (key: keyof BlogFormData, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !isEdit) {
        next.slug = generateSlug(value as string, next.date);
      }
      if (key === "date" && !isEdit) {
        next.slug = generateSlug(next.title, value as string);
      }
      return next;
    });
  };

  /* ── ツールバー挿入 ── */
  const insertMarkdown = useCallback(
    (tool: ToolAction) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const text = form.body;
      const selected = text.substring(start, end);

      let insertion: string;
      if (tool.block && !selected) {
        insertion = `${tool.prefix}テキスト${tool.suffix}`;
      } else {
        insertion = `${tool.prefix}${selected || "テキスト"}${tool.suffix}`;
      }

      const newText = text.substring(0, start) + insertion + text.substring(end);
      update("body", newText);

      // カーソル位置復元
      requestAnimationFrame(() => {
        ta.focus();
        const cursorPos = start + tool.prefix.length + (selected || "テキスト").length;
        ta.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [form.body]
  );

  /* ── 画像アップロード ── */
  const handleImageUpload = useCallback(
    async (file: File, target: "thumbnail" | "body") => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "アップロードに失敗しました");
          return;
        }

        const { url } = await res.json();

        if (target === "thumbnail") {
          update("thumbnail", url);
        } else {
          // 本文に画像を挿入
          const ta = textareaRef.current;
          const pos = ta?.selectionStart || form.body.length;
          const imgMarkdown = `\n![画像](${url})\n`;
          const newBody =
            form.body.substring(0, pos) + imgMarkdown + form.body.substring(pos);
          update("body", newBody);
        }
      } finally {
        setUploading(false);
      }
    },
    [form.body]
  );

  /* ── 本文への画像ドロップ/ペースト ── */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) {
        handleImageUpload(file, "body");
      }
    },
    [handleImageUpload]
  );

  /* ── 送信 ── */
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── 上部: メタ情報 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-5">
          {/* タイトル */}
          <div>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
              placeholder="記事タイトル"
              className="w-full px-4 py-3 border border-gray-200 text-lg font-bold outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* スラグ・タグ・日付 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[0.65rem] text-gray-400 mb-1 tracking-[0.05em]">
                スラグ
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 text-xs outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-[0.65rem] text-gray-400 mb-1 tracking-[0.05em]">
                タグ
              </label>
              <select
                value={form.tag}
                onChange={(e) => update("tag", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
              >
                {TAGS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[0.65rem] text-gray-400 mb-1 tracking-[0.05em]">
                日付
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* 抜粋 */}
          <div>
            <label className="block text-[0.65rem] text-gray-400 mb-1 tracking-[0.05em]">
              抜粋（一覧表示用）
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 text-sm outline-none focus:border-primary transition-colors resize-y"
            />
          </div>
        </div>

        {/* ── 右サイドバー: アイキャッチ + 公開設定 ── */}
        <div className="space-y-5">
          {/* アイキャッチ画像 */}
          <div className="bg-white border border-gray-200 p-4">
            <label className="block text-[0.65rem] text-gray-400 mb-2 tracking-[0.05em]">
              アイキャッチ画像
            </label>
            {form.thumbnail ? (
              <div className="relative aspect-[16/10] bg-gray-100 mb-3">
                <Image
                  src={form.thumbnail}
                  alt="アイキャッチ"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => update("thumbnail", "")}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="aspect-[16/10] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-3">
                <span className="text-xs text-gray-300">画像未設定</span>
              </div>
            )}
            <label className="block w-full text-center py-2 text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
              {uploading ? "アップロード中..." : "画像を選択"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, "thumbnail");
                }}
              />
            </label>
          </div>

          {/* 公開設定 */}
          <div className="bg-white border border-gray-200 p-4">
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
      </div>

      {/* ── 本文エディタ ── */}
      <div className="bg-white border border-gray-200">
        {/* モード切替タブ */}
        <div className="flex items-center border-b border-gray-200">
          <button
            type="button"
            onClick={() => setEditorMode("editor")}
            className={`px-5 py-2.5 text-xs font-bold tracking-[0.05em] transition-colors ${
              editorMode === "editor"
                ? "text-primary border-b-2 border-primary -mb-px"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            エディタ
          </button>
          <button
            type="button"
            onClick={() => setEditorMode("code")}
            className={`px-5 py-2.5 text-xs font-bold tracking-[0.05em] transition-colors ${
              editorMode === "code"
                ? "text-primary border-b-2 border-primary -mb-px"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            コード (Markdown)
          </button>

          {/* 画像挿入ボタン */}
          <label className="ml-auto mr-3 px-3 py-1.5 text-[0.65rem] text-gray-400 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            {uploading ? "..." : "📷 画像挿入"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, "body");
              }}
            />
          </label>
        </div>

        {/* ツールバー（エディタモード時） */}
        {editorMode === "editor" && (
          <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50 flex-wrap">
            {TOOLS.map((tool) => (
              <button
                key={tool.label}
                type="button"
                onClick={() => insertMarkdown(tool)}
                title={tool.label}
                className="px-2.5 py-1.5 text-xs text-gray-500 hover:bg-white hover:text-black border border-transparent hover:border-gray-200 transition-all min-w-[32px] text-center"
              >
                {tool.icon}
              </button>
            ))}
          </div>
        )}

        {/* テキストエリア */}
        <textarea
          ref={textareaRef}
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          rows={editorMode === "editor" ? 20 : 25}
          className={`w-full px-4 py-4 outline-none resize-y ${
            editorMode === "code"
              ? "font-mono text-xs text-gray-600 leading-[1.8]"
              : "text-sm leading-[2.2] text-gray-800"
          }`}
          placeholder={
            editorMode === "editor"
              ? "ここに本文を入力してください。\nツールバーで見出しや太字を簡単に挿入できます。\n画像はドラッグ＆ドロップでも挿入できます。"
              : "## 見出し\n\n本文をMarkdownで入力..."
          }
        />
      </div>

      {/* ── 送信ボタン ── */}
      <div className="flex gap-3 pt-2 sticky bottom-0 bg-gray-50 py-4 -mx-5 sm:-mx-8 px-5 sm:px-8 border-t border-gray-200">
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
          className="px-8 py-3 text-sm text-gray-400 border border-gray-200 hover:bg-white transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
