import SectionHeader from "@/components/ui/SectionHeader";
import pricingData from "@/data/pricing.json";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-black text-white overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-black" />

      <div className="relative z-10 max-w-[1130px] mx-auto">
        <SectionHeader
          label="Price"
          title="ご利用料金"
          description="乗合は3名様から出船。料金はお一人様あたりの金額です。"
          light
        />

        {/* Cards — TCD box_content style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {pricingData.map((plan) => (
            <div
              key={plan.id}
              className="bg-black/90 p-8 sm:p-12 text-center relative group overflow-hidden"
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary-home/0 group-hover:bg-primary-home/20 transition-all duration-700" />

              <div className="relative z-10">
                <span className="text-[0.65rem] text-white/40 tracking-[0.2em] uppercase">
                  {plan.type}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-[0.08em] mt-3 mb-6">
                  {plan.name}
                </h3>

                <div
                  className={`font-serif tracking-[0.05em] mb-2 ${
                    plan.price
                      ? "text-[2rem] sm:text-[2.5rem] text-primary"
                      : "text-xl sm:text-2xl text-primary"
                  }`}
                >
                  {plan.priceLabel}
                  {plan.unit && (
                    <span className="text-sm font-sans text-white/40">
                      {" "}{plan.unit}
                    </span>
                  )}
                </div>
                <p className="text-[0.7rem] text-white/30 mb-8">{plan.note}</p>

                <ul className="text-left max-w-[250px] mx-auto">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="py-2.5 border-t border-white/[0.08] text-[0.8rem] text-white/60 flex items-center gap-3"
                    >
                      <span className="text-primary text-xs">—</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {plan.featured && (
                <div className="absolute top-4 right-4 text-[0.6rem] text-primary tracking-[0.15em] uppercase">
                  Popular
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-white/30 text-xs tracking-[0.05em]">
          ※燃料サーチャージ・エサ代等の追加費用の有無は要確認。料金は税込表示です。
        </p>
      </div>
    </section>
  );
}
