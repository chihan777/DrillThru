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
  Clock,
  Monitor,
  Globe,
  CheckCircle2,
  Circle,
  UserCheck,
  Smartphone,
} from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"
import { getAllUsers, getActiveSessions, getLoginHistory } from "@/app/actions/audit"

export const metadata = {
  title: "Users & Sessions | DrillThru Admin",
  description: "View all users, active sessions, and login history",
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

function parseUserAgent(ua: string | null): { browser: string; device: string } {
  if (!ua || ua === "unknown") return { browser: "Unknown", device: "Unknown" }
  let browser = "Unknown"
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome"
  else if (ua.includes("Firefox")) browser = "Firefox"
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari"
  else if (ua.includes("Edg")) browser = "Edge"
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera"

  let device = "Desktop"
  if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) device = "Mobile"
  else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet"

  return { browser, device }
}

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/admin/sign-in")
  }

  const [users, activeSessions, loginHistoryData] = await Promise.all([
    getAllUsers(),
    getActiveSessions(),
    getLoginHistory(50),
  ])

  // Build a map of userId -> latest session for active users
  const activeUserIds = new Set(activeSessions.map((s) => s.userId))
  const userMap = new Map(users.map((u) => [u.id, u]))

  return (
    <div className="admin-gradient-bg relative overflow-hidden">
      <div className="admin-green-orb -right-32 -top-32 h-[500px] w-[500px]" />
      <div className="admin-green-orb -left-24 bottom-0 h-[400px] w-[400px]" />

      {/* Sidebar */}
      <aside className="admin-sidebar fixed left-0 top-0 z-40 h-screen w-64">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/icon.jpeg" alt="DrillThru" className="h-9 w-9 rounded-lg object-cover" />
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
            <Link href="/admin/enquiries" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <MessageSquare className="h-4 w-4" />
              Enquiries
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <Settings className="h-4 w-4" />
              Site Settings
            </Link>
            <Link href="/admin/activity" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <Activity className="h-4 w-4" />
              Activity Log
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 rounded-lg bg-[#84cc16]/15 px-3 py-2.5 text-sm font-medium text-[#a3e635]">
              <ShieldCheck className="h-4 w-4" />
              Users & Sessions
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
          <div className="mb-8">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#84cc16]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Admin</span>
            </div>
            <h1 className="admin-heading text-3xl">Users & Sessions</h1>
            <p className="admin-muted mt-1">View registered users, active sessions, and login history</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="admin-stat-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#84cc16]/10">
                  <Users className="h-6 w-6 text-[#65a30d]" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a2e0a]">{users.length}</p>
                  <p className="text-sm text-[#6b7f5e]">Total Users</p>
                </div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a2e0a]">{activeUserIds.size}</p>
                  <p className="text-sm text-[#6b7f5e]">Active Users</p>
                </div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Monitor className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a2e0a]">{activeSessions.length}</p>
                  <p className="text-sm text-[#6b7f5e]">Active Sessions</p>
                </div>
              </div>
            </div>
          </div>

          {/* All Users */}
          <div className="admin-card overflow-hidden mb-8">
            <div className="flex items-center justify-between border-b border-[#e2edcf] px-6 py-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#84cc16]" />
                <h2 className="font-semibold text-[#1a2e0a]">Registered Users</h2>
              </div>
              <span className="admin-green-badge">{users.length} total</span>
            </div>
            <div className="divide-y divide-[#e2edcf]">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-[#84cc16]/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#84cc16]/15 text-xs font-bold text-[#65a30d]">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#1a2e0a]">{u.name}</p>
                        {activeUserIds.has(u.id) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Online
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6b7f5e]">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-[#8fa37d]">
                      {u.emailVerified ? (
                        <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Verified</>
                      ) : (
                        <><Circle className="h-3 w-3 text-amber-500" /> Unverified</>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#8fa37d]">
                      Joined {formatDate(u.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login History */}
          <div className="admin-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2edcf] px-6 py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#84cc16]" />
                <h2 className="font-semibold text-[#1a2e0a]">Login History</h2>
              </div>
              <span className="admin-green-badge">{loginHistoryData.length} entries</span>
            </div>

            {loginHistoryData.length === 0 ? (
              <div className="p-14 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#84cc16]/10">
                  <Clock className="h-8 w-8 text-[#84cc16]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#1a2e0a]">No login history yet</h3>
                <p className="text-sm text-[#6b7f5e]">
                  Login events will be recorded here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#e2edcf]">
                {loginHistoryData.map((login) => {
                  const { browser, device } = parseUserAgent(login.userAgent)
                  return (
                    <div key={login.id} className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-[#84cc16]/[0.04]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                          {device === "Mobile" ? (
                            <Smartphone className="h-4 w-4" />
                          ) : (
                            <Monitor className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1a2e0a]">{login.userName}</p>
                          <div className="mt-0.5 flex items-center gap-3 text-xs text-[#6b7f5e]">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {browser}
                            </span>
                            <span>{device}</span>
                            {login.ipAddress && login.ipAddress !== "unknown" && (
                              <span>{login.ipAddress}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#8fa37d]">{timeAgo(login.loginTime)}</p>
                        <p className="text-[11px] text-[#8fa37d]">{login.userEmail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
