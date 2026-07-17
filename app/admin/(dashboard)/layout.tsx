import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AuthGuard } from "@/components/auth-guard"

export const dynamic = "force-dynamic"

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    // Anonymous visitors get a 404 — the admin area is invisible.
    // Admins sign in at /louda/sign-in.
    notFound()
  }

  return (
    <AuthGuard>
      <div className="admin-gradient-bg relative overflow-hidden min-h-screen">
        <div className="admin-green-orb -right-32 -top-32 h-[500px] w-[500px]" />
        <div className="admin-green-orb -left-24 bottom-0 h-[400px] w-[400px]" />

        <AdminSidebar user={{ name: session.user.name, email: session.user.email }} />

        <main className="relative z-10 pt-16 lg:pt-0 lg:pl-64">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
