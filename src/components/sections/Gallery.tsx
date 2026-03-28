import SectionHeader from "@/components/ui/SectionHeader";
import { INSTAGRAM_URL } from "@/lib/constants";

/* --------------------------------------------------------
 * ギャラリーセクション
 *
 * 現在: プレースホルダーグリッド（写真素材待ち）
 *       クリックでInstagramプロフィールへ遷移
 *
 * 本番: Instagram Graph API + next/image で
 *       実際の投稿画像を自動取得・表示（Phase 3）
 * -------------------------------------------------------- */

const galleryItems = [
  { label: "大型カンパチ", sub: "内之浦沖" },
  { label: "ジギング釣果", sub: "種子島海域" },
  { label: "泳がせ釣り", sub: "波見港発" },
  { label: "船上風景", sub: "遊漁船ヤマト" },
  { label: "釣果レポート", sub: "最新の一枚" },
  { label: "大物実績", sub: "10kg超カンパチ" },
  { label: "タックル", sub: "おすすめ装備" },
  { label: "出港風景", sub: "東串良" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-bg-alt">
      <div className="max-w-[1130px] mx-auto">
        <SectionHeader
          label="Gallery"
          title="最新の釣果"
          description="Instagramで最新の釣果情報を発信中。フォローして最新情報をチェック。"
        />

        {/* Grid — TCD Muuri風レイアウト */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[2px]">
          {galleryItems.map((item, i) => (
            <a
              key={item.label}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative group overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 ${
                i === 0
                  ? "col-span-2 row-span-2 aspect-square"
                  : "aspect-square"
              }`}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 z-10" />

              {/* Placeholder content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted/40 text-xs tracking-[0.1em]">
                  PHOTO
                </span>
              </div>

              {/* Hover caption — slides up from bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-white p-4 sm:p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <p className="text-[0.7rem] text-primary tracking-[0.1em] mb-1">
                  {item.sub}
                </p>
                <p className="text-sm font-medium text-black tracking-[0.03em]">
                  {item.label}
                </p>
              </div>
            </a>
          ))}
        </div>

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
