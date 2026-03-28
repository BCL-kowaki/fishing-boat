"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { INSTAGRAM_URL } from "@/lib/constants";

/* --------------------------------------------------------
 * Instagram 埋め込み方式:
 *
 * embed.js + blockquote が唯一の認証不要な方式。
 * ただし閲覧者がInstagramにログインしていないと
 * 表示されないケースがある（Metaの制限）。
 *
 * 本番推奨: Instagram Graph API + ISR (Phase 3)
 * -------------------------------------------------------- */

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const INSTAGRAM_POSTS = [
  "https://www.instagram.com/reel/DFmkwWfTxGy/",
  "https://www.instagram.com/reel/DE54nCYzW4L/",
  "https://www.instagram.com/reel/DEqTWEwTuTp/",
  "https://www.instagram.com/reel/DDvJFHjzCWd/",
  "https://www.instagram.com/reel/DDhj34UTxZn/",
  "https://www.instagram.com/reel/DC8e3JkTXpH/",
];

function InstagramEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // embed.js がロード済みなら処理
    const tryProcess = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    // 少し待ってからprocess
    const t1 = setTimeout(tryProcess, 1500);
    const t2 = setTimeout(tryProcess, 4000);

    // 8秒後にまだiframeが無ければフォールバック
    const t3 = setTimeout(() => {
      if (containerRef.current) {
        const iframe = containerRef.current.querySelector("iframe");
        if (!iframe) {
          setShowFallback(true);
        }
      }
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (showFallback) {
    return <FallbackCard url={url} />;
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          margin: 0,
          maxWidth: "100%",
          minWidth: "100%",
          padding: 0,
          width: "100%",
        }}
      >
        {/* ロード中表示 */}
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 p-4">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
          <span className="text-[0.65rem] text-muted">読み込み中...</span>
        </div>
      </blockquote>
    </div>
  );
}

function FallbackCard({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center w-full h-full min-h-[200px] gap-3 p-6 bg-white hover:bg-gray-50 transition-colors group"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-8 h-8 text-muted group-hover:text-primary transition-colors"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
      <span className="text-xs text-muted group-hover:text-primary transition-colors tracking-[0.05em]">
        Instagramで見る →
      </span>
    </a>
  );
}

export default function Gallery() {
  // embed.js をロード
  useEffect(() => {
    if (document.querySelector('script[src*="instagram.com/embed.js"]')) {
      // 既にあるなら再処理
      if (window.instgrm) window.instgrm.Embeds.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => {
      if (window.instgrm) window.instgrm.Embeds.process();
    };
    document.body.appendChild(script);
  }, []);

  return (
    <section
      id="gallery"
      className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-bg-alt"
    >
      <div className="max-w-[1130px] mx-auto">
        <SectionHeader
          label="Gallery"
          title="最新の釣果"
          description="Instagramの投稿をリアルタイムで自動取得。最新の釣果情報をお届けします。"
        />

        {/* Grid — 1枚目大きく、残りは均等 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px] sm:gap-[15px]">
          {INSTAGRAM_POSTS.map((url, i) => (
            <div
              key={url}
              className={`overflow-hidden ${
                i === 0 ? "col-span-2 row-span-2 min-h-[300px] sm:min-h-[500px]" : "min-h-[200px] sm:min-h-[280px]"
              }`}
            >
              <InstagramEmbed url={url} />
            </div>
          ))}
        </div>

        {/* Follow button */}
        <div className="text-center mt-12">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tcd inline-block w-[240px] sm:w-[270px] leading-[50px] sm:leading-[60px] text-sm border border-black text-black tracking-[0.15em]"
          >
            FOLLOW US
          </a>
        </div>
      </div>
    </section>
  );
}
