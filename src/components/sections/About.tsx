import SectionHeader from "@/components/ui/SectionHeader";

export default function About() {
  return (
    <section
      id="about"
      className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-white"
    >
      <div className="max-w-[1130px] mx-auto text-center">
        <SectionHeader
          label="Concept"
          title="ワタシたちは、海の案内人。"
          description="遊漁船ヤマトは、鹿児島県東串良の波見港を拠点に、泳がせ釣り・ジギングで大物を狙う遊漁船です。内之浦沖から種子島海域まで、船長が長年かけて開拓したポイントへご案内します。"
        />

        {/* Image placeholder */}
        <div className="aspect-[16/9] max-w-[900px] mx-auto bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-muted text-sm mb-12 relative">
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[0.6rem] font-bold px-2 py-0.5">
            要：写真素材
          </span>
          <span>船長または船上の写真</span>
        </div>

        {/* Features — TCD box content style: flex equal columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {[
            { icon: "🎣", title: "泳がせ＆ジギング", desc: "大型カンパチ・底物を狙う本格スタイル" },
            { icon: "🗺️", title: "内之浦・種子島", desc: "豊かな漁場へ確かなナビゲーション" },
            { icon: "🚢", title: "船のスペック", desc: "※情報準備中" },
            { icon: "🛡️", title: "安全対策", desc: "※情報準備中" },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white p-6 sm:p-8 text-center"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h4 className="font-sans text-sm font-semibold tracking-[0.05em] text-black mb-2">
                {f.title}
              </h4>
              <p className="text-xs text-muted leading-[1.8]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
