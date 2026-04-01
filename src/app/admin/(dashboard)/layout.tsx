import { requireAuth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      {/* Mobile header */}
      <div className="md:hidden bg-black text-white px-5 py-3 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.1em]">YAMATO Admin</span>
        <a href="/admin/login" className="text-xs text-white/50">Logout</a>
      </div>
      <main className="md:ml-64 p-5 sm:p-8">{children}</main>
    </div>
  );
}
