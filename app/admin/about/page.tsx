import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import {
  LayoutDashboard,
  Plus,
  Users,
  Sparkles,
  Briefcase,
  MessageSquare,
  Settings,
  Activity,
  ShieldCheck,
} from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"
import { AdminAboutForm } from "@/components/admin-about-form"
import { getAboutSettings, getValues, getTeam, getProjects, getTestimonials } from "@/app/actions/about"

export const metadata = {
  title: "Manage About Section | DrillThru",
  description: "Edit the about section content",
}

export default async function AdminAboutPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/admin/sign-in")
  }

  const [settings, values, team, projects, testimonials] = await Promise.all([
    getAboutSettings(),
    getValues(),
    getTeam(),
    getProjects(),
    getTestimonials(),
  ])

  return (
    <div className="admin-gradient-bg relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="admin-green-orb -right-32 -top-32 h-[500px] w-[500px]" />
      <div className="admin-green-orb -left-24 bottom-0 h-[400px] w-[400px]" />

      {/* Sidebar */}
      <aside className="admin-sidebar fixed left-0 top-0 z-40 h-screen w-64">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/icon.jpeg" alt="DrillThru" className="h-9 w-9 rounded-lg object-cover" />
              <span className="font-bold tracking-tight text-white">
                DrillThru
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/about"
              className="flex items-center gap-3 rounded-lg bg-[#84cc16]/15 px-3 py-2.5 text-sm font-medium text-[#a3e635]"
            >
              <Users className="h-4 w-4" />
              About Section
            </Link>
            <Link
              href="/admin/services"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Briefcase className="h-4 w-4" />
              Services
            </Link>
            <Link
              href="/admin/enquiries"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <MessageSquare className="h-4 w-4" />
              Enquiries
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Site Settings
            </Link>
            <Link
              href="/admin/activity"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Activity className="h-4 w-4" />
              Activity Log
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" />
              Users & Sessions
            </Link>
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </nav>

          {/* User */}
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#84cc16]/20 text-sm font-bold text-[#a3e635]">
                {session.user.name?.charAt(0) ||
                  session.user.email?.charAt(0) ||
                  "A"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {session.user.name || "Admin"}
                </p>
                <p className="truncate text-xs text-white/40">
                  {session.user.email}
                </p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 pl-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#84cc16]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">
                Admin
              </span>
            </div>
            <h1 className="admin-heading text-3xl">About Section</h1>
            <p className="admin-muted mt-1">
              Manage your about page content — text, values, and team members
            </p>
          </div>

          <AdminAboutForm settings={settings} values={values} team={team} projects={projects} testimonials={testimonials} />
        </div>
      </main>
    </div>
  )
}
