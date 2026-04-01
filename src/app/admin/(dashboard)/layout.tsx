import { requireAuth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminMobileHeader />
      <main className="md:ml-64 p-5 sm:p-8">{children}</main>
    </div>
  );
}
