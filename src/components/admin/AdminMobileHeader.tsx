"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/blog", label: "ブログ管理" },
  { href: "/admin/calendar", label: "カレンダー管理" },
];

export default function AdminMobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="md:hidden">
      {/* Header bar */}
      <div className="bg-black text-white px-5 py-3 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.1em]">YAMATO Admin</span>
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          aria-label="メニュー"
        >
          {open ? (
            <span className="text-lg">✕</span>
          ) : (
            <div className="space-y-1">
              <span className="block w-4 h-px bg-current" />
              <span className="block w-4 h-px bg-current" />
              <span className="block w-4 h-px bg-current" />
            </div>
          )}
        </button>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="bg-black border-t border-white/10">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-5 py-3 text-sm tracking-[0.05em] transition-colors ${
                  active
                    ? "text-primary bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block px-5 py-3 text-sm text-white/40 hover:text-white/60 tracking-[0.05em] border-t border-white/10 transition-colors"
          >
            サイトを表示 →
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-5 py-3 text-sm text-red-400/70 hover:text-red-400 tracking-[0.05em] transition-colors"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
