import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminDashboardPage() {
  // Server-side protection (redirect-like UX via link)
  try {
    await requireAdmin();
  } catch {
    return (
      <div className="pt-24 min-h-screen">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="rounded-xl border bg-card p-6">
            <h1 className="text-2xl font-display font-bold mb-2">Unauthorized</h1>
            <p className="text-sm text-muted-foreground mb-6">
              You need to login first.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Go to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <AdminDashboard />
      </div>
    </div>
  );
}

