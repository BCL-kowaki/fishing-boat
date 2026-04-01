import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { INSTAGRAM_URL } from "@/lib/constants";

/* --------------------------------------------------------
 * Instagram ギャラリー — Behold.so 連携
 *
 * Behold.so は Instagram API の認証・トークン更新を
 * 全て代行してくれるサービス。
 * こちらは専用URLに fetch するだけで投稿データのJSONを取得。
 *
 * セットアップ:
 * 1. https://behold.so でアカウント作成（無料プランあり）
 * 2. Instagramアカウントを接続
 * 3. Feed を作成 → Feed ID を取得
 * 4. .env.local に NEXT_PUBLIC_BEHOLD_FEED_ID=xxxxx を設定
 *
 * Feed IDが未設定の場合はプレースホルダーを表示。
 * -------------------------------------------------------- */

type BeholdPost = {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp: string;
};

async function fetchInstagramPosts(): Promise<BeholdPost[]> {
  const feedId = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;
  if (!feedId) return [];

  try {
    const res = await fetch(`https://feeds.behold.so/${feedId}`, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).slice(0, 8);
  } catch {
    return [];
  }
}

function PlaceholderCard({ label, sub }: { label: string; sub: string }) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 aspect-square"
    >
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 z-10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-muted/40 text-xs tracking-[0.1em]">PHOTO</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white p-4 sm:p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <p className="text-[0.7rem] text-primary tracking-[0.1em] mb-1">{sub}</p>
        <p className="text-sm font-medium text-black tracking-[0.03em]">{label}</p>
      </div>
    </a>
  );
}

const placeholderItems = [
  { label: "大型カンパチ", sub: "内之浦沖" },
  { label: "ジギング釣果", sub: "種子島海域" },
  { label: "泳がせ釣り", sub: "波見港発" },
  { label: "船上風景", sub: "遊漁船ヤマト" },
  { label: "釣果レポート", sub: "最新の一枚" },
  { label: "大物実績", sub: "10kg超カンパチ" },
  { label: "タックル", sub: "おすすめ装備" },
  { label: "出港風景", sub: "東串良" },
];

export default async function Gallery() {
  const posts = await fetchInstagramPosts();
  const hasPosts = posts.length > 0;

  return (
    <section id="gallery" className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-bg-alt">
      <div className="max-w-[1130px] mx-auto">
        <SectionHeader
          label="Gallery"
          title="最新の釣果"
          description="Instagramで最新の釣果情報を発信中。フォローして最新情報をチェック。"
        />

        {hasPosts ? (
          /* ── Behold データあり: 実際のIG投稿を表示 ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[10px]">
            {posts.map((post, i) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group overflow-hidden bg-gray-200 ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                }`}
              >
                <Image
                  src={post.mediaType === "VIDEO" ? (post.thumbnailUrl || post.mediaUrl) : post.mediaUrl}
                  alt={post.caption?.slice(0, 60) || "Instagram投稿"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes={i === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 z-10" />
                {/* Caption on hover */}
                {post.caption && (
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-white text-[0.65rem] sm:text-xs leading-[1.6] line-clamp-2">
                      {post.caption.slice(0, 80)}
                    </p>
                  </div>
                )}
              </a>
            ))}
          </div>
        ) : (
          /* ── データなし: プレースホルダー ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[10px]">
            {placeholderItems.map((item, i) => (
              <div
                key={item.label}
                className={i === 0 ? "col-span-2 row-span-2" : ""}
              >
                <PlaceholderCard label={item.label} sub={item.sub} />
              </div>
            ))}
          </div>
        )}

        {/* Instagram follow CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-muted text-xs tracking-[0.1em] mb-6">
            @fishingboat_yamato
          </p>
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
