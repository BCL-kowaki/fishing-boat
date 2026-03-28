"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { INSTAGRAM_URL } from "@/lib/constants";

/* --------------------------------------------------------
 * Instagram oEmbed を Next.js 側で使う方法:
 *
 * 1. blockquote + embed.js 方式
 *    → 2024以降、ログイン壁やCORS制限で表示されないケースが多い
 *
 * 2. oEmbed API (api.instagram.com/oembed) 方式
 *    → 公開投稿なら認証不要でHTMLを返してくれる
 *    → ただしクライアントから直接叩くとCORSエラー
 *    → Next.js API Route経由でプロキシするのが正解
 *
 * 3. 本番推奨: Instagram Graph API + ISR (Phase 3)
 *
 * 今回は「2. oEmbed API (サーバー側プロキシ)」+
 * 「1. embed.js フォールバック」の組み合わせで実装
 * -------------------------------------------------------- */

const INSTAGRAM_POSTS = [
  "https://www.instagram.com/fishingboat_yamato/reel/DFmkwWfTxGy/",
  "https://www.instagram.com/fishingboat_yamato/reel/DE54nCYzW4L/",
  "https://www.instagram.com/fishingboat_yamato/reel/DEqTWEwTuTp/",
  "https://www.instagram.com/fishingboat_yamato/reel/DDvJFHjzCWd/",
  "https://www.instagram.com/fishingboat_yamato/reel/DDhj34UTxZn/",
  "https://www.instagram.com/fishingboat_yamato/reel/DC8e3JkTXpH/",
];

function EmbedCard({
  url,
  large = false,
}: {
  url: string;
  large?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const fetchEmbed = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/instagram/oembed?url=${encodeURIComponent(url)}`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.html) {
        setHtml(data.html);
      } else {
        throw new Error("No HTML");
      }
    } catch {
      // oEmbed API失敗 → embed.jsフォールバック
      setError(true);
    }
  }, [url]);

  useEffect(() => {
    fetchEmbed();
  }, [fetchEmbed]);

  // oEmbed HTML挿入後にembed.jsで処理
  useEffect(() => {
    if (html && ref.current) {
      ref.current.innerHTML = html;
      if (window.instgrm) {
        window.instgrm.Embeds.process(ref.current);
      }
    }
  }, [html]);

  // embed.jsフォールバック: blockquote方式
  useEffect(() => {
    if (error && ref.current && window.instgrm) {
      window.instgrm.Embeds.process(ref.current);
    }
  }, [error]);

  const minH = large
    ? "min-h-[300px] sm:min-h-[500px]"
    : "min-h-[200px] sm:min-h-[280px]";

  if (error) {
    // embed.jsフォールバック
    return (
      <div ref={ref} className={`bg-white overflow-hidden ${minH}`}>
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
          <FallbackCard url={url} />
        </blockquote>
      </div>
    );
  }

  if (!html) {
    return (
      <div className={`bg-white flex items-center justify-center ${minH}`}>
        <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`bg-white overflow-hidden [&_iframe]:!max-w-full [&_iframe]:!min-w-full ${minH}`}
    />
  );
}

function FallbackCard({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 p-6 text-center hover:bg-gray-50 transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-muted">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
      <span className="text-xs text-muted">Instagramで見る →</span>
    </a>
  );
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process: (el?: HTMLElement) => void } };
  }
}

export default function Gallery() {
  // embed.jsをロード
  useEffect(() => {
    if (document.querySelector('script[src*="instagram.com/embed.js"]'))
      return;
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.onload = () => {
      if (window.instgrm) window.instgrm.Embeds.process();
    };
    document.body.appendChild(s);
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

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-[10px] sm:gap-[15px]">
          {INSTAGRAM_POSTS.map((url, i) => (
            <div
              key={url}
              className={i === 0 ? "col-span-2 row-span-2" : ""}
            >
              <EmbedCard url={url} large={i === 0} />
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
