import { Sparkles, MessageSquare, Mail, MailOpen, Calendar, Building2 } from "lucide-react"
import { AdminEnquiryActions } from "@/components/admin-enquiry-actions"
import { getEnquiries } from "@/app/actions/contact"

export const metadata = {
  title: "Enquiries | DrillThru Admin",
  description: "View and manage user enquiries",
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

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries()
  const unreadCount = enquiries.filter((e) => !e.read).length
  const readCount = enquiries.filter((e) => e.read).length

  return (
    <>
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#84cc16]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Admin</span>
        </div>
        <h1 className="admin-heading text-2xl sm:text-3xl">Enquiries</h1>
        <p className="admin-muted mt-1">View and manage messages from your website visitors</p>
      </div>

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
            <p className="text-sm text-[#6b7f5e]">When visitors submit enquiries through your website, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e2edcf]">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className={`px-6 py-5 transition-colors hover:bg-[#84cc16]/[0.04] ${!enquiry.read ? "bg-[#84cc16]/[0.03]" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#84cc16]/15 text-xs font-bold text-[#65a30d]">
                        {enquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-semibold text-[#1a2e0a]">{enquiry.name}</h3>
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
                          <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1 transition-colors hover:text-[#65a30d]">
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
    </>
  )
}
