"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/blog", label: "ブログ管理" },
  { href: "/admin/calendar", label: "カレンダー管理" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-black text-white hidden md:flex flex-col z-40">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-sm font-bold tracking-[0.1em]">YAMATO Admin</h2>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 text-sm tracking-[0.05em] transition-colors ${
                active
                  ? "text-primary bg-white/5"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="block text-xs text-white/30 hover:text-white/60 transition-colors tracking-[0.05em]"
        >
          サイトを表示 →
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs text-white/30 hover:text-red-400 transition-colors tracking-[0.05em]"
        >
          ログアウト
        </button>
      </div>
    </aside>
  );
}
