import Link from "next/link"
import { db } from "@/lib/db"
import { servicePages } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { Plus, FileText, Eye, EyeOff, Sparkles, Briefcase, Calendar, PenTool } from "lucide-react"
import { AdminServiceActions } from "@/components/admin-service-actions"

export const metadata = {
  title: "Manage Services | DrillThru Admin",
  description: "Manage your service pages",
}

async function getAllServices() {
  try {
    return await db.select().from(servicePages).orderBy(asc(servicePages.order))
  } catch (error) {
    console.warn("Failed to fetch services:", error)
    return []
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date)
}

export default async function AdminServicesPage() {
  const services = await getAllServices()
  const publishedCount = services.filter((s) => s.published).length
  const draftCount = services.filter((s) => !s.published).length

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#84cc16]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Admin</span>
          </div>
          <h1 className="admin-heading text-3xl">Service Pages</h1>
          <p className="admin-muted mt-1">Manage dynamic service pages with SEO optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/services/content" className="flex items-center gap-2 rounded-lg border border-[#e2edcf] bg-white px-4 py-2.5 text-sm font-medium text-[#1a2e0a] hover:bg-[#f7faf3] transition-colors">
            <PenTool className="h-4 w-4" />
            Edit Page Content
          </Link>
          <Link href="/admin/services/new" className="admin-btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
            <Plus className="h-4 w-4" />
            New Service
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="admin-stat-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#84cc16]/10">
              <Briefcase className="h-6 w-6 text-[#65a30d]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a2e0a]">{services.length}</p>
              <p className="text-sm text-[#6b7f5e]">Total Services</p>
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <Eye className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a2e0a]">{publishedCount}</p>
              <p className="text-sm text-[#6b7f5e]">Published</p>
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <EyeOff className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a2e0a]">{draftCount}</p>
              <p className="text-sm text-[#6b7f5e]">Drafts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e2edcf] px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#84cc16]" />
            <h2 className="font-semibold text-[#1a2e0a]">All Service Pages</h2>
          </div>
          <span className="admin-green-badge">{services.length} total</span>
        </div>
        {services.length === 0 ? (
          <div className="p-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#84cc16]/10">
              <Briefcase className="h-8 w-8 text-[#84cc16]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#1a2e0a]">No service pages yet</h3>
            <p className="mb-6 text-sm text-[#6b7f5e]">Create your first service page to get started</p>
            <Link href="/admin/services/new" className="admin-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
              <Plus className="h-4 w-4" />
              Create Service Page
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e2edcf]">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#84cc16]/[0.04]">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate font-medium text-[#1a2e0a]">{service.title}</h3>
                    {service.published ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-4 text-xs text-[#6b7f5e]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(service.createdAt)}
                    </span>
                    <span className="rounded bg-[#84cc16]/8 px-2 py-0.5 font-mono text-[#65a30d]">
                      /services/{service.slug}
                    </span>
                  </div>
                </div>
                <AdminServiceActions service={service} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
