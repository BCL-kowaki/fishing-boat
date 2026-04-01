"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback } from "react";

type Props = {
  content: string;
  onChange: (html: string) => void;
  onImageUpload: (file: File) => Promise<string>;
};

/* ── ツールバーボタン ── */
function ToolBtn({
  active,
  onClick,
  children,
  title,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2 py-1.5 text-xs min-w-[30px] text-center transition-all border border-transparent ${
        active
          ? "bg-primary/10 text-primary border-primary/20"
          : "text-gray-500 hover:bg-gray-100 hover:text-black"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-gray-200 mx-1" />;
}

export default function RichEditor({ content, onChange, onImageUpload }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      ImageExt.configure({
        HTMLAttributes: { class: "max-w-full h-auto my-4" },
      }),
      Placeholder.configure({
        placeholder: "ここに本文を入力してください...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[400px] px-5 py-4 outline-none text-gray-800 leading-[2] focus:outline-none",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            onImageUpload(file).then((url) => {
              if (url && editor) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  /* ── リンク挿入 ── */
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URLを入力", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  /* ── 画像挿入 ── */
  const handleImageInsert = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        const url = await onImageUpload(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  /* ── テキストカラー ── */
  const setTextColor = useCallback(
    (color: string) => {
      if (!editor) return;
      if (color === "default") {
        editor.chain().focus().unsetColor().run();
      } else {
        editor.chain().focus().setColor(color).run();
      }
    },
    [editor]
  );

  /* ── ハイライト ── */
  const setHighlight = useCallback(
    (color: string) => {
      if (!editor) return;
      if (color === "none") {
        editor.chain().focus().unsetHighlight().run();
      } else {
        editor.chain().focus().setHighlight({ color }).run();
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="bg-white border border-gray-200">
      {/* ── ツールバー ── */}
      <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
        {/* 見出し */}
        <ToolBtn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="見出し2"
        >
          H2
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="見出し3"
        >
          H3
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("heading", { level: 4 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          title="見出し4"
        >
          H4
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
          title="本文"
        >
          P
        </ToolBtn>

        <Divider />

        {/* 文字装飾 */}
        <ToolBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="太字"
        >
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="斜体"
        >
          <em>I</em>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="下線"
        >
          <span className="underline">U</span>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="取り消し線"
        >
          <span className="line-through">S</span>
        </ToolBtn>

        <Divider />

        {/* 文字色 */}
        <div className="relative group">
          <ToolBtn active={false} onClick={() => {}} title="文字色">
            <span className="flex items-center gap-1">
              A<span className="w-3 h-1 bg-red-500 block" />
            </span>
          </ToolBtn>
          <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-lg p-2 hidden group-hover:grid grid-cols-5 gap-1 min-w-[140px]">
            {[
              { color: "default", label: "デフォルト", bg: "#333" },
              { color: "#e74c3c", label: "赤", bg: "#e74c3c" },
              { color: "#2980b9", label: "青", bg: "#2980b9" },
              { color: "#27ae60", label: "緑", bg: "#27ae60" },
              { color: "#f39c12", label: "オレンジ", bg: "#f39c12" },
              { color: "#8e44ad", label: "紫", bg: "#8e44ad" },
              { color: "#1abc9c", label: "ティール", bg: "#1abc9c" },
              { color: "#e67e22", label: "茶", bg: "#e67e22" },
              { color: "#7f8c8d", label: "灰", bg: "#7f8c8d" },
              { color: "#2c3e50", label: "濃紺", bg: "#2c3e50" },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => setTextColor(c.color)}
                title={c.label}
                className="w-6 h-6 border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: c.bg }}
              />
            ))}
          </div>
        </div>

        {/* 背景色 */}
        <div className="relative group">
          <ToolBtn
            active={editor.isActive("highlight")}
            onClick={() => {}}
            title="マーカー"
          >
            <span className="bg-yellow-200 px-0.5">M</span>
          </ToolBtn>
          <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-lg p-2 hidden group-hover:grid grid-cols-4 gap-1 min-w-[120px]">
            {[
              { color: "none", label: "なし", bg: "transparent" },
              { color: "#fef9c3", label: "黄", bg: "#fef9c3" },
              { color: "#bbf7d0", label: "緑", bg: "#bbf7d0" },
              { color: "#bfdbfe", label: "青", bg: "#bfdbfe" },
              { color: "#fecaca", label: "赤", bg: "#fecaca" },
              { color: "#e9d5ff", label: "紫", bg: "#e9d5ff" },
              { color: "#fed7aa", label: "橙", bg: "#fed7aa" },
              { color: "#e5e7eb", label: "灰", bg: "#e5e7eb" },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => setHighlight(c.color)}
                title={c.label}
                className="w-6 h-6 border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: c.bg }}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* 配置 */}
        <ToolBtn
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="左揃え"
        >
          ≡
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="中央揃え"
        >
          ≡
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="右揃え"
        >
          ≡
        </ToolBtn>

        <Divider />

        {/* リスト */}
        <ToolBtn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="箇条書き"
        >
          ・
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="番号リスト"
        >
          1.
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="引用"
        >
          &ldquo;
        </ToolBtn>

        <Divider />

        {/* リンク・画像・区切り線 */}
        <ToolBtn
          active={editor.isActive("link")}
          onClick={setLink}
          title="リンク"
        >
          🔗
        </ToolBtn>
        <ToolBtn
          active={false}
          onClick={handleImageInsert}
          title="画像挿入"
        >
          📷
        </ToolBtn>
        <ToolBtn
          active={false}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="区切り線"
        >
          ─
        </ToolBtn>

        <Divider />

        {/* 元に戻す・やり直し */}
        <ToolBtn
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="元に戻す"
        >
          ↩
        </ToolBtn>
        <ToolBtn
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="やり直し"
        >
          ↪
        </ToolBtn>
      </div>

      {/* ── エディタ本体 ── */}
      <EditorContent editor={editor} />
    </div>
  );
}
