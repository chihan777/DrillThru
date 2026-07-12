import Link from "next/link"
import { Plus, Sparkles } from "lucide-react"
import { getProjects } from "@/app/actions/projects"
import { AdminProjectList } from "@/components/admin-project-list"

export const metadata = {
  title: "Manage Projects | DrillThru Admin",
  description: "Manage your showcase projects",
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#84cc16]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Admin</span>
          </div>
          <h1 className="admin-heading text-3xl">Projects</h1>
          <p className="admin-muted mt-1">Drag the arrows to reorder how projects appear on the homepage</p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <AdminProjectList projects={projects} />
    </>
  )
}
