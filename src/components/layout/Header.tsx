"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import { NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // トップページのみ透明ヘッダー、それ以外は常に白背景
  const isHome = pathname === "/";
  const showDark = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (href.startsWith("#") && !isHome) {
      // 内側ページからハッシュリンクはトップに戻る
      window.location.href = `/${href}`;
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showDark
            ? "bg-transparent"
            : "bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)]"
        }`}
      >
        <div className="max-w-[1130px] mx-auto flex items-center justify-between px-5 h-[60px] sm:h-[80px]">
          {/* Logo */}
          <a
            href="/"
            className="relative h-[30px] sm:h-[40px] w-[120px] sm:w-[160px]"
          >
            {/* 白ロゴ — トップページのスクロール前のみ */}
            <Image
              src="/images/logo_white.png"
              alt="遊漁船ヤマト"
              fill
              className={`object-contain object-left transition-opacity duration-500 ${
                showDark ? "opacity-100" : "opacity-0"
              }`}
              priority
            />
            {/* 通常ロゴ */}
            <Image
              src="/images/logo.png"
              alt="遊漁船ヤマト"
              fill
              className={`object-contain object-left transition-opacity duration-500 ${
                showDark ? "opacity-0" : "opacity-100"
              }`}
              priority
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-[0.7rem] tracking-[0.15em] font-medium transition-colors duration-300 hover:text-primary ${
                  showDark ? "text-white" : "text-black"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Hamburger */}
          <button
            className="lg:hidden p-3 -mr-3"
            onClick={() => setMenuOpen(true)}
            aria-label="メニュー"
          >
            <div className="space-y-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`block w-5 h-px transition-colors ${
                    showDark ? "bg-white" : "bg-black"
                  }`}
                />
              ))}
            </div>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
