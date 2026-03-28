import SectionHeader from "@/components/ui/SectionHeader";

const blogPosts = [
  {
    tag: "釣果レポート",
    date: "2026.03.25",
    title: "内之浦沖で大型カンパチ連発！春の好シーズン到来",
    excerpt: "朝一から活性高く、泳がせで10kg級カンパチが次々とヒット…",
  },
  {
    tag: "タックル紹介",
    date: "2026.03.20",
    title: "種子島ジギングにおすすめのタックルセッティング",
    excerpt: "PE3号〜4号、ジグ200g〜300gを中心に当船での実績タックルを紹介…",
  },
  {
    tag: "お知らせ",
    date: "2026.03.15",
    title: "4月の出船スケジュール＆空き状況のお知らせ",
    excerpt: "4月は種子島便を中心に出船予定。GW期間の予約も受付開始…",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-white">
      <div className="max-w-[1130px] mx-auto">
        <SectionHeader
          label="Blog"
          title="船長の航海日誌"
          description="釣行レポート、海況情報、タックル紹介など。"
        />

        {/* Cards — TCD carousel card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-[10px]">
          {blogPosts.map((post) => (
            <div
              key={post.title}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                <div className="flex items-center justify-center h-full text-muted-light text-xs">
                  サムネイル
                </div>
              </div>

              {/* Content */}
              <div className="pt-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[0.6rem] text-primary tracking-[0.1em] border border-primary/30 px-2 py-0.5">
                    {post.tag}
                  </span>
                  <span className="text-[0.65rem] text-muted-light tracking-[0.05em]">
                    {post.date}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-black leading-[1.8] group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* More button */}
        <div className="text-center mt-12">
          <a
            href="#blog"
            className="btn-tcd inline-block w-[240px] sm:w-[270px] leading-[50px] sm:leading-[60px] text-sm border border-black text-black tracking-[0.15em]"
          >
            VIEW ALL
          </a>
        </div>
      </div>
    </section>
  );
}
