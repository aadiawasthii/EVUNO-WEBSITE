import { requireAdminSession } from "@/lib/auth/admin";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();

  return <>{children}</>;
}
