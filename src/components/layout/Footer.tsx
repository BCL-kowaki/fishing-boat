import {
  SITE_NAME,
  PHONE_NUMBER,
  PHONE_TEL,
  ADDRESS,
  INSTAGRAM_URL,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main */}
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] px-6">
        <div className="text-center">
          <div className="font-serif text-2xl sm:text-3xl tracking-[0.15em] font-bold mb-8">
            {SITE_NAME}
          </div>

          <div className="text-white/50 text-xs sm:text-sm leading-[2.5] tracking-[0.1em]">
            <p>{ADDRESS}</p>
            <p>
              <a href={PHONE_TEL} className="hover:text-primary transition-colors">
                TEL {PHONE_NUMBER}
              </a>
            </p>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 text-sm tracking-[0.15em] hover:text-primary transition-colors"
            >
              INSTAGRAM
            </a>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-[0.65rem] text-white/30 tracking-[0.15em]">
            <a href="#about" className="hover:text-primary transition-colors">ワタシたちは</a>
            <a href="#gallery" className="hover:text-primary transition-colors">ギャラリー</a>
            <a href="#pricing" className="hover:text-primary transition-colors">料金</a>
            <a href="#blog" className="hover:text-primary transition-colors">ブログ</a>
            <a href="#calendar" className="hover:text-primary transition-colors">予約</a>
            <a href="#contact" className="hover:text-primary transition-colors">お問い合わせ</a>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-[0.65rem] text-white/30 tracking-[0.1em] leading-[50px]">
        &copy; 2026 {SITE_NAME} All Rights Reserved.
      </div>
    </footer>
  );
}
