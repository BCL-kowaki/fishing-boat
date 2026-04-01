"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

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

function generateRandomSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * HTMLを人間が読みやすいように整形する
 * ブロック要素の前後に改行を入れる
 */
function formatHtml(html: string): string {
  if (!html) return "";
  // 一旦改行を全て除去して正規化
  let formatted = html.replace(/\n/g, "").replace(/>\s+</g, "><");
  // ブロック要素の前に改行を挿入
  const blockTags = ["h2", "h3", "h4", "p", "ul", "ol", "li", "blockquote", "hr", "div", "figure", "img"];
  for (const tag of blockTags) {
    formatted = formatted.replace(new RegExp(`<${tag}`, "gi"), `\n<${tag}`);
    formatted = formatted.replace(new RegExp(`</${tag}>`, "gi"), `</${tag}>\n`);
  }
  // 自閉じタグの後にも改行
  formatted = formatted.replace(/<(hr|br|img)([^>]*)\/?>/gi, "<$1$2/>\n");
  // 連続改行を1つに
  formatted = formatted.replace(/\n{3,}/g, "\n\n");
  return formatted.trim();
}

/**
 * 整形されたHTMLを圧縮（保存用）
 * 不要な改行を除去してTiptapが処理しやすい形にする
 */
function compactHtml(html: string): string {
  if (!html) return "";
  return html
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("");
}

export default function BlogForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [form, setForm] = useState<BlogFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || generateRandomSlug(),
    tag: initialData?.tag || TAGS[0],
    date: initialData?.date || new Date().toISOString().split("T")[0],
    excerpt: initialData?.excerpt || "",
    body: initialData?.body || "",
    thumbnail: initialData?.thumbnail || "",
    published: initialData?.published || false,
  });
  const [saving, setSaving] = useState(false);
  const [editorMode, setEditorMode] = useState<"editor" | "code">("editor");
  const [codeValue, setCodeValue] = useState("");
  const [uploading, setUploading] = useState(false);

  const update = (key: keyof BlogFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // モード切替ハンドラ
  const switchToCode = () => {
    // ビジュアル → HTML: 現在のbodyを整形して表示
    setCodeValue(formatHtml(form.body));
    setEditorMode("code");
  };

  const switchToEditor = () => {
    // HTML → ビジュアル: コードの内容をbodyに反映
    update("body", compactHtml(codeValue));
    setEditorMode("editor");
  };

  const handleThumbnailUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("crop", "16:9");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "アップロードに失敗しました");
        return;
      }
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, thumbnail: url }));
    } finally {
      setUploading(false);
    }
  }, []);

  const handleBodyImageUpload = useCallback(async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) return "";
    const { url } = await res.json();
    return url;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // HTMLモードで保存する場合はcodeValueを反映
      const body = editorMode === "code" ? compactHtml(codeValue) : form.body;
      const submitData = { ...form, body };

      const url = isEdit ? `/api/blog/${initialData!.id}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        {/* 右サイドバー */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 p-4">
            <label className="block text-[0.65rem] text-gray-400 mb-2 tracking-[0.05em]">
              アイキャッチ画像
            </label>
            {form.thumbnail ? (
              <div className="relative aspect-[16/10] bg-gray-100 mb-3 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.thumbnail}
                  alt="アイキャッチ"
                  className="w-full h-full object-cover"
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
                  if (file) handleThumbnailUpload(file);
                }}
              />
            </label>
          </div>

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

      {/* 本文エディタ */}
      <div>
        <div className="flex items-center border border-gray-200 border-b-0 bg-gray-50">
          <button
            type="button"
            onClick={switchToEditor}
            className={`px-5 py-2.5 text-xs font-bold tracking-[0.05em] transition-colors ${
              editorMode === "editor"
                ? "text-primary border-b-2 border-primary bg-white"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            ビジュアルエディタ
          </button>
          <button
            type="button"
            onClick={switchToCode}
            className={`px-5 py-2.5 text-xs font-bold tracking-[0.05em] transition-colors ${
              editorMode === "code"
                ? "text-primary border-b-2 border-primary bg-white"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            HTML
          </button>
        </div>

        {editorMode === "editor" ? (
          <RichEditor
            content={form.body}
            onChange={(html) => update("body", html)}
            onImageUpload={handleBodyImageUpload}
          />
        ) : (
          <textarea
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
            rows={25}
            className="w-full px-4 py-4 border border-gray-200 outline-none font-mono text-xs text-gray-600 leading-[2] resize-y whitespace-pre-wrap"
            placeholder={"<h2>見出し</h2>\n\n<p>本文をHTMLで入力...</p>"}
          />
        )}
      </div>

      {/* 送信ボタン */}
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
