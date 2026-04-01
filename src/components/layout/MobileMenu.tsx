"use client";

import { NAV_LINKS, PHONE_TEL, PHONE_NUMBER } from "@/lib/constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: Props) {
  const handleClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer from right */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[400px] bg-black z-[9999] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center text-white/60 text-xl hover:text-white transition-colors"
          aria-label="閉じる"
        >
          ✕
        </button>

        <nav className="flex flex-col items-start justify-center h-full px-10 gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="text-white/80 text-lg font-sans tracking-[0.1em] py-3 hover:text-primary transition-colors min-h-[48px]"
            >
              {link.label}
            </button>
          ))}

          <div className="mt-8 pt-8 border-t border-white/10 w-full">
            <a
              href={PHONE_TEL}
              className="text-primary text-lg tracking-[0.1em] font-sans"
            >
              {PHONE_NUMBER}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
