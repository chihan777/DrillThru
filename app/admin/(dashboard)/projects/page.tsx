import Link from "next/link"
import { Plus, FolderOpen, Sparkles } from "lucide-react"
import { getProjects } from "@/app/actions/projects"
import { AdminProjectActions } from "@/components/admin-project-actions"

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
          <p className="admin-muted mt-1">Manage your showcase projects</p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e2edcf] px-6 py-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-[#84cc16]" />
            <h2 className="font-semibold text-[#1a2e0a]">All Projects</h2>
          </div>
          <span className="admin-green-badge">{projects.length} total</span>
        </div>
        {projects.length === 0 ? (
          <div className="p-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#84cc16]/10">
              <FolderOpen className="h-8 w-8 text-[#84cc16]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#1a2e0a]">No projects yet</h3>
            <p className="mb-6 text-sm text-[#6b7f5e]">Create your first showcase project</p>
            <Link href="/admin/projects/new" className="admin-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
              <Plus className="h-4 w-4" />
              Create Project
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e2edcf]">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#84cc16]/[0.04]">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${project.color}`} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-[#1a2e0a]">{project.title}</h3>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6b7f5e]">
                      <span className="rounded bg-[#84cc16]/8 px-2 py-0.5 font-mono text-[#65a30d]">{project.category}</span>
                      {project.link && <span>Has link</span>}
                    </div>
                  </div>
                </div>
                <AdminProjectActions project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
