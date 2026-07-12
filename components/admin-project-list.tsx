"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, FolderOpen, ChevronUp, ChevronDown, Sparkles } from "lucide-react"
import { reorderProject } from "@/app/actions/projects"
import { AdminProjectActions } from "@/components/admin-project-actions"

interface Project {
  id: number
  title: string
  category: string
  description: string
  image: string | null
  link: string | null
  color: string
  order: number
}

export function AdminProjectList({ projects: initial }: { projects: Project[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState(initial)
  const [movingId, setMovingId] = useState<number | null>(null)

  async function handleReorder(id: number, direction: "up" | "down") {
    setMovingId(id)
    const idx = projects.findIndex((p) => p.id === id)
    if (idx === -1) return
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= projects.length) { setMovingId(null); return }

    const updated = [...projects]
    ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]
    setProjects(updated)

    await reorderProject(id, direction)
    setMovingId(null)
    router.refresh()
  }

  if (projects.length === 0) {
    return (
      <div className="admin-card overflow-hidden p-14 text-center">
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
    )
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#e2edcf] px-6 py-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-[#84cc16]" />
          <h2 className="font-semibold text-[#1a2e0a]">All Projects</h2>
        </div>
        <span className="admin-green-badge">{projects.length} total</span>
      </div>
      <div className="divide-y divide-[#e2edcf]">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#84cc16]/[0.04]"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="flex flex-col items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => handleReorder(project.id, "up")}
                  disabled={index === 0 || movingId === project.id}
                  className="rounded p-0.5 text-[#94a388] transition-colors hover:text-[#84cc16] disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] font-mono text-[#94a388]">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleReorder(project.id, "down")}
                  disabled={index === projects.length - 1 || movingId === project.id}
                  className="rounded p-0.5 text-[#94a388] transition-colors hover:text-[#84cc16] disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
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
    </div>
  )
}
