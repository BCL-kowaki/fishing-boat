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
 * .env.local に NEXT_PUBLIC_BEHOLD_FEED_ID=xxxxx を設定
 * Feed IDが未設定の場合はプレースホルダーを表示。
 * -------------------------------------------------------- */

type BeholdSize = {
  mediaUrl: string;
  height: number;
  width: number;
};

type BeholdPost = {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
  prunedCaption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp: string;
  sizes?: {
    small?: BeholdSize;
    medium?: BeholdSize;
    large?: BeholdSize;
    full?: BeholdSize;
  };
  missingVideoThumbnail?: boolean;
};

function getImageUrl(post: BeholdPost, large = false): string {
  // 動画でサムネイルがない場合はプレースホルダー
  if (post.mediaType === "VIDEO" && post.missingVideoThumbnail) {
    return "";
  }
  // sizes から適切なサイズを選択
  if (post.sizes) {
    if (large && post.sizes.large) return post.sizes.large.mediaUrl;
    if (post.sizes.medium) return post.sizes.medium.mediaUrl;
    if (post.sizes.small) return post.sizes.small.mediaUrl;
  }
  return post.mediaUrl;
}

async function fetchInstagramPosts(): Promise<BeholdPost[]> {
  const feedId = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;
  if (!feedId) return [];

  try {
    const res = await fetch(`https://feeds.behold.so/${feedId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Behold のレスポンス: { username, posts: [...] }
    const posts = data?.posts || data;
    if (!Array.isArray(posts)) return [];
    return posts.slice(0, 24);
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[6px] sm:gap-[10px]">
            {posts.map((post) => {
              const imgUrl = getImageUrl(post, false);
              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group overflow-hidden bg-gray-200 aspect-square"
                >
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={post.prunedCaption?.slice(0, 60) || post.caption?.slice(0, 60) || "Instagram投稿"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                      <span className="text-xs text-gray-400">▶ VIDEO</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 z-10" />
                  {/* Caption on hover */}
                  {(post.prunedCaption || post.caption) && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="text-white text-[0.65rem] sm:text-xs leading-[1.6] line-clamp-2">
                        {(post.prunedCaption || post.caption || "").slice(0, 80)}
                      </p>
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[6px] sm:gap-[10px]">
            {placeholderItems.map((item) => (
              <PlaceholderCard key={item.label} label={item.label} sub={item.sub} />
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
