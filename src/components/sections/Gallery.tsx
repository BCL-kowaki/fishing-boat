"use client";

import { useEffect } from "react";
import Script from "next/script";
import SectionHeader from "@/components/ui/SectionHeader";
import { INSTAGRAM_URL, INSTAGRAM_POSTS } from "@/lib/constants";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function LoadingPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[280px] text-muted gap-3 p-4 text-center">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
      <span className="text-xs">{text}</span>
    </div>
  );
}

function PlaceholderCard({ index }: { index: number }) {
  return (
    <div className="bg-bg-alt flex flex-col items-center justify-center min-h-[200px] sm:min-h-[280px] gap-2 group cursor-pointer relative overflow-hidden">
      <div className="text-2xl opacity-20">📷</div>
      <span className="text-[0.65rem] text-muted">投稿 #{index}</span>
    </div>
  );
}

export default function Gallery() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.instgrm) window.instgrm.Embeds.process();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleScriptLoad = () => {
    if (window.instgrm) window.instgrm.Embeds.process();
  };

  return (
    <section id="gallery" className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-bg-alt">
      <div className="max-w-[1130px] mx-auto">
        <SectionHeader
          label="Gallery"
          title="最新の釣果"
          description="Instagramの投稿をリアルタイムで自動取得。最新の釣果情報をお届けします。"
        />

        {/* Grid — TCD Muuri-style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[10px] sm:gap-[15px]">
          {/* Large post */}
          <div className="col-span-2 row-span-2 overflow-hidden bg-white">
            <blockquote
              className="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink={INSTAGRAM_POSTS[0]}
              data-instgrm-version="14"
              style={{ background: "#FFF", border: 0, margin: 0, maxWidth: "100%", minWidth: "100%", padding: 0, width: "100%" }}
            >
              <LoadingPlaceholder text="読み込み中..." />
            </blockquote>
          </div>

          {/* Post 2 */}
          <div className="overflow-hidden bg-white">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={INSTAGRAM_POSTS[1]}
              data-instgrm-version="14"
              style={{ background: "#FFF", border: 0, margin: 0, maxWidth: "100%", minWidth: "100%", padding: 0, width: "100%" }}
            >
              <LoadingPlaceholder text="読み込み中..." />
            </blockquote>
          </div>

          {[3, 4, 5, 6].map((i) => (
            <PlaceholderCard key={i} index={i} />
          ))}
        </div>

        {/* Follow button — TCD style */}
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

      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
    </section>
  );
}
