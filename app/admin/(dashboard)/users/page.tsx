import { Sparkles, Users, Clock, Monitor, Globe, CheckCircle2, Circle, UserCheck, Smartphone } from "lucide-react"
import { getAllUsers, getActiveSessions, getLoginHistory } from "@/app/actions/audit"

export const metadata = {
  title: "Users & Sessions | DrillThru Admin",
  description: "View all users, active sessions, and login history",
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date)
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
  const [users, activeSessions, loginHistoryData] = await Promise.all([
    getAllUsers(),
    getActiveSessions(),
    getLoginHistory(50),
  ])

  const activeUserIds = new Set(activeSessions.map((s) => s.userId))

  return (
    <>
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#84cc16]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Admin</span>
        </div>
        <h1 className="admin-heading text-2xl sm:text-3xl">Users & Sessions</h1>
        <p className="admin-muted mt-1">View registered users, active sessions, and login history</p>
      </div>

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
            <div key={u.id} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-[#84cc16]/[0.04] sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#84cc16]/15 text-xs font-bold text-[#65a30d]">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-[#1a2e0a]">{u.name}</p>
                    {activeUserIds.has(u.id) && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Online
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-[#6b7f5e]">{u.email}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-1 text-xs text-[#8fa37d]">
                  {u.emailVerified ? (
                    <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Verified</>
                  ) : (
                    <><Circle className="h-3 w-3 text-amber-500" /> Unverified</>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-[#8fa37d]">Joined {formatDate(u.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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
            <p className="text-sm text-[#6b7f5e]">Login events will be recorded here.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e2edcf]">
            {loginHistoryData.map((login) => {
              const { browser, device } = parseUserAgent(login.userAgent)
              return (
                <div key={login.id} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-[#84cc16]/[0.04] sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                      {device === "Mobile" ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1a2e0a]">{login.userName}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#6b7f5e]">
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{browser}</span>
                        <span>{device}</span>
                        {login.ipAddress && login.ipAddress !== "unknown" && <span>{login.ipAddress}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-[#8fa37d]">{timeAgo(login.loginTime)}</p>
                    <p className="max-w-[120px] truncate text-[11px] text-[#8fa37d]">{login.userEmail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
