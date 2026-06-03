import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Briefcase,
  Plus,
  MessageSquare,
  Mail,
  MailOpen,
  Calendar,
  Building2,
} from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"
import { AdminEnquiryActions } from "@/components/admin-enquiry-actions"
import { getEnquiries } from "@/app/actions/contact"

export const metadata = {
  title: "Enquiries | DrillThru Admin",
  description: "View and manage user enquiries",
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(date)
}

export default async function AdminEnquiriesPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/admin/sign-in")
  }

  const enquiries = await getEnquiries()
  const unreadCount = enquiries.filter((e) => !e.read).length
  const readCount = enquiries.filter((e) => e.read).length

  return (
    <div className="admin-gradient-bg relative overflow-hidden">
      <div className="admin-green-orb -right-32 -top-32 h-[500px] w-[500px]" />
      <div className="admin-green-orb -left-24 bottom-0 h-[400px] w-[400px]" />

      {/* Sidebar */}
      <aside className="admin-sidebar fixed left-0 top-0 z-40 h-screen w-64">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-[#84cc16]">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <span className="font-bold tracking-tight text-white">DrillThru</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/admin/about" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <Users className="h-4 w-4" />
              About Section
            </Link>
            <Link href="/admin/services" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <Briefcase className="h-4 w-4" />
              Services
            </Link>
            <Link href="/admin/enquiries" className="flex items-center gap-3 rounded-lg bg-[#84cc16]/15 px-3 py-2.5 text-sm font-medium text-[#a3e635]">
              <MessageSquare className="h-4 w-4" />
              Enquiries
              {unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#84cc16] px-1.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link href="/admin/posts/new" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </nav>
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#84cc16]/20 text-sm font-bold text-[#a3e635]">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "A"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{session.user.name || "Admin"}</p>
                <p className="truncate text-xs text-white/40">{session.user.email}</p>
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
              <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Admin</span>
            </div>
            <h1 className="admin-heading text-3xl">Enquiries</h1>
            <p className="admin-muted mt-1">View and manage messages from your website visitors</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="admin-stat-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#84cc16]/10">
                  <MessageSquare className="h-6 w-6 text-[#65a30d]" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a2e0a]">{enquiries.length}</p>
                  <p className="text-sm text-[#6b7f5e]">Total Enquiries</p>
                </div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a2e0a]">{unreadCount}</p>
                  <p className="text-sm text-[#6b7f5e]">Unread</p>
                </div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <MailOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a2e0a]">{readCount}</p>
                  <p className="text-sm text-[#6b7f5e]">Read</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="admin-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2edcf] px-6 py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#84cc16]" />
                <h2 className="font-semibold text-[#1a2e0a]">All Enquiries</h2>
              </div>
              <span className="admin-green-badge">{enquiries.length} total</span>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-14 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#84cc16]/10">
                  <MessageSquare className="h-8 w-8 text-[#84cc16]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#1a2e0a]">No enquiries yet</h3>
                <p className="text-sm text-[#6b7f5e]">
                  When visitors submit enquiries through your website, they will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#e2edcf]">
                {enquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className={`px-6 py-5 transition-colors hover:bg-[#84cc16]/[0.04] ${
                      !enquiry.read ? "bg-[#84cc16]/[0.03]" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        {/* Name + Badge */}
                        <div className="mb-1 flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#84cc16]/15 text-xs font-bold text-[#65a30d]">
                            {enquiry.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate font-semibold text-[#1a2e0a]">
                                {enquiry.name}
                              </h3>
                              {!enquiry.read ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  New
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  Read
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-[#6b7f5e]">
                              <a
                                href={`mailto:${enquiry.email}`}
                                className="flex items-center gap-1 transition-colors hover:text-[#65a30d]"
                              >
                                <Mail className="h-3 w-3" />
                                {enquiry.email}
                              </a>
                              {enquiry.company && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {enquiry.company}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {timeAgo(enquiry.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        <p className="mt-3 rounded-lg bg-[#f0f7e4]/60 px-4 py-3 text-sm leading-relaxed text-[#3d5a1e]">
                          {enquiry.message}
                        </p>
                      </div>

                      <AdminEnquiryActions enquiry={enquiry} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
