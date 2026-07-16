"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { Save, Loader2, CheckCircle2, Eye, ArrowLeft, Clock } from "lucide-react"
import { toast } from "sonner"

export default function ServiceContentEditor() {
  const router = useRouter()
  const [title, setTitle] = useState("Services")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentRef = useRef(content)
  contentRef.current = content

  useEffect(() => {
    fetch("/api/services/content")
      .then((r) => r.json())
      .then((data) => {
        if (data.title) setTitle(data.title)
        if (data.content) setContent(data.content)
        if (data.updatedAt) setLastSaved(new Date(data.updatedAt).toLocaleString())
      })
      .catch(() => toast.error("Failed to load content"))
      .finally(() => setLoading(false))
  }, [])

  const save = useCallback(async (showToast = true) => {
    setSaving(true)
    try {
      const res = await fetch("/api/services/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: contentRef.current }),
      })
      const data = await res.json()
      if (data.success) {
        setLastSaved(new Date().toLocaleString())
        if (showToast) toast.success("Content saved successfully!")
      } else {
        toast.error(data.error || "Failed to save")
      }
    } catch {
      toast.error("Failed to save content")
    } finally {
      setSaving(false)
    }
  }, [title])

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => save(false), 5000)
  }, [save])

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#84cc16]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button onClick={() => router.back()} className="mb-2 flex items-center gap-1 text-sm text-[#6b7f5e] hover:text-[#84cc16] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-[#1a2e0a]">Page Content Editor</h1>
          <p className="mt-1 text-sm text-[#6b7f5e]">Edit the main body content of the Services page</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {lastSaved && (
            <span className="flex items-center gap-1.5 text-xs text-[#6b7f5e]">
              <Clock className="h-3.5 w-3.5" /> Last saved: {lastSaved}
            </span>
          )}
          <a
            href="/services"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#e2edcf] bg-white px-4 py-2 text-sm font-medium text-[#1a2e0a] hover:bg-[#f7faf3] transition-colors"
          >
            <Eye className="h-4 w-4" /> Preview
          </a>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#84cc16] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#65a30d] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="admin-card p-5">
        <label className="admin-label mb-1.5 block text-[11px]">Page Title</label>
        <input
          className="admin-input text-lg font-semibold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page title"
        />
      </div>

      {/* Editor */}
      <div className="admin-card overflow-hidden p-0">
        <div className="border-b border-[#e2edcf] px-5 py-3">
          <h3 className="text-sm font-bold text-[#1a2e0a]">Page Content</h3>
          <p className="text-xs text-[#6b7f5e]">Main body content of the service page — what you write here appears on the live website</p>
        </div>
        <div className="p-4">
          <RichTextEditor content={content} onChange={handleContentChange} onSave={() => save(true)} saving={saving} />
        </div>
      </div>
    </div>
  )
}
