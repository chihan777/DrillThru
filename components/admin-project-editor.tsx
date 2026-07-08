"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Upload, ImageIcon, Loader2, ArrowLeft } from "lucide-react"
import { createProject, updateProject } from "@/app/actions/projects"
import { uploadImage } from "@/app/actions/about"
import Link from "next/link"

const COLOR_OPTIONS = [
  { label: "Blue/Purple", value: "from-blue-500/20 to-purple-500/20" },
  { label: "Orange/Red", value: "from-orange-500/20 to-red-500/20" },
  { label: "Green/Teal", value: "from-green-500/20 to-teal-500/20" },
  { label: "Pink/Rose", value: "from-pink-500/20 to-rose-500/20" },
  { label: "Lime/Green", value: "from-lime-500/20 to-green-500/20" },
  { label: "Cyan/Blue", value: "from-cyan-500/20 to-blue-500/20" },
]

interface ProjectData {
  id: number
  title: string
  category: string
  description: string
  image: string | null
  link: string | null
  color: string
  order: number
}

interface Props {
  project?: ProjectData
}

export function AdminProjectEditor({ project }: Props) {
  const router = useRouter()
  const isEditing = !!project

  const [form, setForm] = useState({
    title: project?.title ?? "",
    category: project?.category ?? "",
    description: project?.description ?? "",
    image: project?.image ?? "",
    link: project?.link ?? "",
    color: project?.color ?? "from-blue-500/20 to-purple-500/20",
  })
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(project?.image ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function compressImage(file: File, maxWidthPx = 1200, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const scale = Math.min(1, maxWidthPx / img.width)
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            resolve(new File([blob], file.name, { type: "image/webp", lastModified: Date.now() }))
          },
          "image/webp",
          quality,
        )
      }
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
      img.src = url
    })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      const result = await uploadImage(compressed)
      if (result.success && result.url) {
        setForm({ ...form, image: result.url })
        setImagePreview(result.url)
      } else {
        alert("Upload failed: " + (result.error || "Unknown error"))
      }
    } catch (err) {
      alert("Upload error: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError(null)

    const fd = new FormData()
    fd.set("title", form.title)
    fd.set("category", form.category)
    fd.set("description", form.description)
    fd.set("image", form.image)
    fd.set("link", form.link)
    fd.set("color", form.color)

    const res = isEditing
      ? await updateProject(project.id, fd)
      : await createProject(fd)

    if (res.success) {
      router.push("/admin/projects")
      router.refresh()
    } else {
      setError(res.error || "Failed to save project.")
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#65a30d] hover:text-[#84cc16]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Projects
        </Link>
        <div className="mt-2">
          <h1 className="admin-heading text-3xl">{isEditing ? "Edit Project" : "New Project"}</h1>
          <p className="admin-muted mt-1">{isEditing ? "Update project details" : "Add a new showcase project"}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="admin-card max-w-2xl p-6">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label mb-1 block text-[11px]">Title</label>
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Himalayan Trails"
              />
            </div>
            <div>
              <label className="admin-label mb-1 block text-[11px]">Category</label>
              <input
                className="admin-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Web Development + SEO"
              />
            </div>
          </div>

          <div>
            <label className="admin-label mb-1 block text-[11px]">Description</label>
            <textarea
              className="admin-textarea !min-h-[5rem]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Project description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label mb-1 block text-[11px]">Project Link</label>
              <input
                className="admin-input"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://... (optional)"
              />
            </div>
            <div>
              <label className="admin-label mb-1 block text-[11px]">Color Theme</label>
              <select
                className="admin-input"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              >
                {COLOR_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="admin-label mb-1 block text-[11px]">Image</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-[#e2edcf]">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-20 w-32 items-center justify-center rounded-lg border-2 border-dashed border-[#e2edcf] bg-white/50">
                  <ImageIcon className="h-6 w-6 text-[#94a388]" />
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d4e4bc] px-4 py-2 text-xs font-medium text-[#1a2e0a] transition-colors hover:border-[#84cc16] hover:bg-[#84cc16]/5">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setForm({ ...form, image: "" }); setImagePreview(null) }}
                  className="rounded-lg p-2 text-[#6b7f5e] hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="admin-btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
            </button>
            <Link
              href="/admin/projects"
              className="flex items-center gap-1.5 rounded-lg border border-[#d4e4bc] px-4 py-2.5 text-xs font-medium text-[#1a2e0a] hover:bg-white"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
