import SectionHeader from "@/components/ui/SectionHeader";
import { COMPANY_INFO, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/constants";

export default function Company() {
  return (
    <section id="company" className="py-[clamp(2.5rem,8vw,9.375rem)] px-5 bg-bg-alt">
      <div className="max-w-[900px] mx-auto">
        <SectionHeader label="Access" title="会社概要" />

        {/* Table — 外枠borderなし、項目と値の背景を統一 */}
        <div>
          {COMPANY_INFO.map((row) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row border-b border-border/60"
            >
              <div className="sm:w-[180px] px-5 py-3 sm:py-4 text-[0.75rem] font-medium text-black tracking-[0.05em] bg-bg-alt shrink-0">
                {row.label}
              </div>
              <div className="px-5 pb-3 sm:py-4 text-sm text-muted leading-[1.8] bg-bg-alt">
                {row.value}
              </div>
            </div>
          ))}
          <div className="flex flex-col sm:flex-row border-b border-border/60">
            <div className="sm:w-[180px] px-5 py-3 sm:py-4 text-[0.75rem] font-medium text-black tracking-[0.05em] bg-bg-alt shrink-0">
              Instagram
            </div>
            <div className="px-5 pb-3 sm:py-4 text-sm leading-[1.8] bg-bg-alt">
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

        {/* Google Maps */}
        <div className="mt-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3406.8409884421294!2d131.0155208!3d31.3633669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x353ebf09b13b9065%3A0xca47d500be71c388!2z5p2x5Liy6Imv5rivL-azouimi-a4ryjmvIHmuK8p!5e0!3m2!1sja!2sjp!4v1775067171841!5m2!1sja!2sjp"
            className="w-full aspect-[16/9] sm:aspect-[16/7]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="波見港 Google Maps"
          />
        </div>
      </div>
    </section>
  );
}
