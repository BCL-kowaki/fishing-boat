import SectionHeader from "@/components/ui/SectionHeader";
import { COMPANY_INFO, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/constants";

export default function Company() {
  return (
    <section id="company" className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-bg-alt">
      <div className="max-w-[900px] mx-auto">
        <SectionHeader label="Access" title="会社概要" />

        {/* Table */}
        <div className="bg-white border border-border">
          {COMPANY_INFO.map((row) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row border-b border-border last:border-b-0"
            >
              <div className="sm:w-[180px] px-5 py-3 sm:py-4 text-[0.75rem] font-medium text-black tracking-[0.05em] bg-bg-alt sm:bg-bg-alt shrink-0">
                {row.label}
              </div>
              <div className="px-5 py-2 sm:py-4 text-sm text-muted leading-[1.8]">
                {row.value}
              </div>
            </div>
          ))}
          <div className="flex flex-col sm:flex-row border-b border-border last:border-b-0">
            <div className="sm:w-[180px] px-5 py-3 sm:py-4 text-[0.75rem] font-medium text-black tracking-[0.05em] bg-bg-alt shrink-0">
              Instagram
            </div>
            <div className="px-5 py-2 sm:py-4 text-sm leading-[1.8]">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-8 aspect-[16/9] sm:aspect-[16/7] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-muted text-sm border border-border">
          Google Maps 埋め込み — 波見港
        </div>
      </div>
    </section>
  );
}
