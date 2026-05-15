import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata = {
  title: "Admin Login"
};

export default function AdminLoginPage() {
  return (
    <section className="shell py-20">
      <AdminLoginForm />
    </section>
  );
}
