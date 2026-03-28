"use client";

import { useState, useEffect } from "react";
import MobileMenu from "./MobileMenu";
import { NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1130px] mx-auto flex items-center justify-between px-5 h-[60px] sm:h-[80px]">
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, "#top")}
            className={`font-serif font-bold text-base sm:text-lg tracking-[0.1em] transition-colors duration-500 ${
              scrolled ? "text-black" : "text-white"
            }`}
          >
            遊漁船ヤマト
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-[0.7rem] tracking-[0.15em] font-medium transition-colors duration-300 hover:text-primary ${
                  scrolled ? "text-black" : "text-white"
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
              <span
                className={`block w-5 h-px transition-colors ${
                  scrolled ? "bg-black" : "bg-white"
                }`}
              />
              <span
                className={`block w-5 h-px transition-colors ${
                  scrolled ? "bg-black" : "bg-white"
                }`}
              />
              <span
                className={`block w-5 h-px transition-colors ${
                  scrolled ? "bg-black" : "bg-white"
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
