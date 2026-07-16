import { Sparkles, Activity, Clock, MapPin, Users } from "lucide-react"
import { getActivityLogs } from "@/app/actions/audit"

export const metadata = {
  title: "Activity Log | DrillThru Admin",
  description: "View all admin changes and activity",
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

function getActionColor(action: string) {
  switch (action.toLowerCase()) {
    case "created": return "bg-emerald-500/10 text-emerald-600"
    case "updated": return "bg-blue-500/10 text-blue-600"
    case "deleted": return "bg-red-500/10 text-red-600"
    case "published": return "bg-emerald-500/10 text-emerald-600"
    case "unpublished": return "bg-amber-500/10 text-amber-600"
    case "marked read": return "bg-blue-500/10 text-blue-600"
    case "marked unread": return "bg-amber-500/10 text-amber-600"
    default: return "bg-gray-500/10 text-gray-600"
  }
}

export default async function AdminActivityPage() {
  const logs = await getActivityLogs(200)

  return (
    <>
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#84cc16]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Admin</span>
        </div>
        <h1 className="admin-heading text-2xl sm:text-3xl">Activity Log</h1>
        <p className="admin-muted mt-1">Track all changes made to the site and see who made them</p>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e2edcf] px-6 py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#84cc16]" />
            <h2 className="font-semibold text-[#1a2e0a]">Recent Activity</h2>
          </div>
          <span className="admin-green-badge">{logs.length} entries</span>
        </div>
        {logs.length === 0 ? (
          <div className="p-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#84cc16]/10">
              <Activity className="h-8 w-8 text-[#84cc16]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#1a2e0a]">No activity yet</h3>
            <p className="text-sm text-[#6b7f5e]">Changes made to the site will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e2edcf]">
            {logs.map((log) => (
              <div key={log.id} className="px-6 py-4 transition-colors hover:bg-[#84cc16]/[0.04]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-[#1a2e0a]">{log.target}</span>
                    </div>
                    {log.details && <p className="text-xs text-[#6b7f5e]">{log.details}</p>}
                    <div className="mt-1.5 flex items-center gap-4 text-[11px] text-[#8fa37d]">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {log.userName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(log.createdAt)}
                      </span>
                      {log.ipAddress && log.ipAddress !== "unknown" && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {log.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
