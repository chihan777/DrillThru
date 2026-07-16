"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Save, Send, Eye, EyeOff, Search, AlertCircle, CheckCircle2, Info,
  Globe, Sparkles, Loader2, Plus, Trash2, Star, ChevronDown, ChevronUp,
  FileText, MessageSquare, Zap, Image, Settings, BarChart3, Link2,
} from "lucide-react"
import { createService, updateService } from "@/app/actions/services"
import { RichTextEditor } from "@/components/editor/rich-text-editor"

interface FAQ { question: string; answer: string }
interface Testimonial { name: string; role: string; company: string; content: string; rating: number }
interface Project { title: string; description: string; image: string; link: string }

interface ServiceData {
  id: number
  title: string
  slug: string
  description: string
  content: string
  icon: string
  featuredImage: string | null
  projectLink: string | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  canonicalUrl: string | null
  ogImage: string | null
  twitterCard: string
  robotsMeta: string
  ctaHeading: string | null
  ctaDescription: string | null
  ctaButtonText: string
  ctaButtonLink: string
  published: boolean
  order: number
  faqs: FAQ[]
  testimonials: Testimonial[]
  projects: Project[]
}

interface ServiceEditorProps {
  service?: ServiceData
}

const ICON_OPTIONS = [
  "Globe", "Search", "Megaphone", "Target", "Palette", "BarChart3", "Zap", "MousePointerClick",
  "Code", "Smartphone", "ShoppingCart", "Mail", "Camera", "Video", "Pen", "TrendingUp",
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function analyzeSEO(data: { title: string; metaTitle: string; metaDesc: string; content: string; keywords: string; faqCount: number; testimonialCount: number; hasCta: boolean; hasFeaturedImage: boolean }) {
  const titleLen = data.metaTitle.length
  const descLen = data.metaDesc.length
  const words = data.content.split(/\s+/).filter((w) => w.length > 0).length
  const suggestions: string[] = []
  let score = 0

  // Title (10 pts)
  if (!data.title) suggestions.push("Add a service title")
  else score += 10

  // Meta title (10 pts)
  if (titleLen >= 20 && titleLen <= 70) score += 10
  else if (titleLen > 0) { score += 5; suggestions.push("Meta title ideally 30-60 characters") }

  // Meta description (10 pts)
  if (data.metaDesc) score += 10
  else suggestions.push("Add a meta description")

  // Meta description length (10 pts)
  if (descLen >= 80 && descLen <= 170) score += 10
  else if (descLen > 0) { score += 5; suggestions.push("Meta description ideally 120-160 characters") }

  // Content exists (10 pts)
  if (data.content) score += 10

  // Word count (15 pts)
  if (words >= 300) score += 15
  else if (words >= 150) { score += 8; suggestions.push("Content should be at least 300 words for better SEO") }
  else if (data.content) suggestions.push("Content should be at least 300 words for better SEO")

  // Title length > 10 (5 pts)
  if (data.title && data.title.length > 10) score += 5

  // Keywords (10 pts)
  if (data.keywords && data.keywords.trim().length > 0) score += 10
  else suggestions.push("Add SEO keywords to improve discoverability")

  // FAQs (10 pts)
  if (data.faqCount >= 3) score += 10
  else if (data.faqCount >= 1) { score += 5; suggestions.push("Add at least 3 FAQs for better SEO") }
  else suggestions.push("Add FAQs to help customers find answers")

  // Testimonials (10 pts)
  if (data.testimonialCount >= 2) score += 10
  else if (data.testimonialCount >= 1) { score += 5; suggestions.push("Add at least 2 testimonials for trust") }
  else suggestions.push("Add testimonials to build credibility")

  // CTA (5 pts)
  if (data.hasCta) score += 5
  else suggestions.push("Add a Call to Action section")

  // Featured image (5 pts)
  if (data.hasFeaturedImage) score += 5
  else suggestions.push("Add a featured image for visual appeal")

  return { titleLen, descLen, words, score: Math.min(score, 100), suggestions }
}

/* ── Collapsible Section ─────────────────────────────────────────────────── */
function Section({
  icon: Icon, title, subtitle, children, defaultOpen = true, count,
}: {
  icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode; defaultOpen?: boolean; count?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="admin-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/40"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#84cc16]/10">
            <Icon className="h-4.5 w-4.5 text-[#65a30d]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1a2e0a]">{title}</h3>
            <p className="text-xs text-[#6b7f5e]">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {count !== undefined && count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#84cc16] px-1.5 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-[#6b7f5e]" /> : <ChevronDown className="h-4 w-4 text-[#6b7f5e]" />}
        </div>
      </button>
      {open && <div className="border-t border-[#e2edcf] p-5">{children}</div>}
    </div>
  )
}

/* ── Char Counter Bar ────────────────────────────────────────────────────── */
function CharBar({ current, min, max, label }: { current: number; min: number; max: number; label: string }) {
  const isGood = current >= min && current <= max
  const pct = Math.min((current / max) * 100, 100)
  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className={isGood ? "text-[#65a30d]" : current > 0 ? "text-amber-600" : "text-[#6b7f5e]"}>
          {current} / {max} {isGood ? "✓" : current > max ? "Too long" : current > 0 ? "Too short" : label}
        </span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#e2edcf]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${isGood ? "bg-[#84cc16]" : current > max ? "bg-red-400" : "bg-amber-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ── Main Editor ─────────────────────────────────────────────────────────── */
export function ServiceEditor({ service }: ServiceEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSEO, setShowSEO] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)

  const [title, setTitle] = useState(service?.title ?? "")
  const [slug, setSlug] = useState(service?.slug ?? "")
  const [description, setDescription] = useState(service?.description ?? "")
  const [content, setContent] = useState(service?.content ?? "")
  const [icon, setIcon] = useState(service?.icon ?? "Globe")
  const [featuredImage, setFeaturedImage] = useState(service?.featuredImage ?? "")
  const [projectLink, setProjectLink] = useState(service?.projectLink ?? "")
  const [imageFileName, setImageFileName] = useState("")
  const [order, setOrder] = useState(service?.order ?? 0)
  const [published, setPublished] = useState(service?.published ?? false)

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFeaturedImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
    setImageFileName(file.name)
  }

  // SEO
  const [seoTitle, setSeoTitle] = useState(service?.seoTitle ?? "")
  const [seoDescription, setSeoDescription] = useState(service?.seoDescription ?? "")
  const [seoKeywords, setSeoKeywords] = useState(service?.seoKeywords ?? "")
  const [canonicalUrl, setCanonicalUrl] = useState(service?.canonicalUrl ?? "")
  const [ogImage, setOgImage] = useState(service?.ogImage ?? "")
  const [twitterCard, setTwitterCard] = useState(service?.twitterCard ?? "summary_large_image")
  const [robotsMeta, setRobotsMeta] = useState(service?.robotsMeta ?? "index,follow")

  // CTA
  const [ctaHeading, setCtaHeading] = useState(service?.ctaHeading ?? "")
  const [ctaDescription, setCtaDescription] = useState(service?.ctaDescription ?? "")
  const [ctaButtonText, setCtaButtonText] = useState(service?.ctaButtonText ?? "Get Started")
  const [ctaButtonLink, setCtaButtonLink] = useState(service?.ctaButtonLink ?? "#contact")

  // FAQs & Testimonials
  const [faqs, setFaqs] = useState<FAQ[]>(service?.faqs ?? [])
  const [testimonials, setTestimonials] = useState<Testimonial[]>(service?.testimonials ?? [])

  // Projects
  const [projects, setProjects] = useState<Project[]>(service?.projects ?? [])

  const seo = analyzeSEO({ title, metaTitle: seoTitle, metaDesc: seoDescription, content, keywords: seoKeywords, faqCount: faqs.length, testimonialCount: testimonials.length, hasCta: !!ctaHeading, hasFeaturedImage: !!featuredImage })

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited) {
      setSlug(generateSlug(title))
    }
  }, [title, slugEdited])

  // Auto-fill SEO fields from content
  useEffect(() => { if (!seoTitle && title) setSeoTitle(title) }, [title, seoTitle])
  useEffect(() => { if (!seoDescription && description) setSeoDescription(description) }, [description, seoDescription])

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }])
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i))
  const updateFaq = (i: number, field: keyof FAQ, value: string) => {
    const copy = [...faqs]
    copy[i] = { ...copy[i], [field]: value }
    setFaqs(copy)
  }

  const addTestimonial = () => setTestimonials([...testimonials, { name: "", role: "", company: "", content: "", rating: 5 }])
  const removeTestimonial = (i: number) => setTestimonials(testimonials.filter((_, idx) => idx !== i))
  const updateTestimonial = (i: number, field: keyof Testimonial, value: string | number) => {
    const copy = [...testimonials]
    copy[i] = { ...copy[i], [field]: value }
    setTestimonials(copy)
  }

  const handleSubmit = useCallback(async (publish: boolean) => {
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    if (!title.trim() || !description.trim() || !content.trim()) {
      setError("Please fill in Title, Description, and Content — these are required.")
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("content", content)
    formData.append("icon", icon)
    formData.append("featuredImage", featuredImage)
    formData.append("order", String(order))
    formData.append("published", String(publish))
    formData.append("seoTitle", seoTitle || title)
    formData.append("seoDescription", seoDescription || description)
    formData.append("seoKeywords", seoKeywords)
    formData.append("canonicalUrl", canonicalUrl)
    formData.append("ogImage", ogImage)
    formData.append("twitterCard", twitterCard)
    formData.append("robotsMeta", robotsMeta)
    formData.append("ctaHeading", ctaHeading)
    formData.append("ctaDescription", ctaDescription)
    formData.append("ctaButtonText", ctaButtonText)
    formData.append("ctaButtonLink", ctaButtonLink)
    formData.append("slug", slug || generateSlug(title))
    formData.append("projectLink", projectLink)
    formData.append("faqs", JSON.stringify(faqs.filter((f) => f.question && f.answer)))
    formData.append("testimonials", JSON.stringify(testimonials.filter((t) => t.name && t.content)))
    formData.append("projects", JSON.stringify(projects.filter((p) => p.title)))

    try {
      const result = service
        ? await updateService(service.id, formData)
        : await createService(formData)

      if (result.success) {
        setPublished(publish)
        setSuccess(publish ? "Service page published successfully!" : service ? "Service updated!" : "Draft saved!")
        if (!service && "id" in result && result.id) {
          router.push(`/admin/services/${result.id}`)
        } else {
          router.refresh()
        }
      } else {
        setError(result.error || "Something went wrong.")
      }
    } catch {
      setError("Failed to save. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }, [title, slug, description, content, icon, featuredImage, projectLink, order, seoTitle, seoDescription, seoKeywords, canonicalUrl, ogImage, twitterCard, robotsMeta, ctaHeading, ctaDescription, ctaButtonText, ctaButtonLink, faqs, testimonials, projects, service, router])

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="admin-card sticky top-[72px] z-20 mx-auto mb-6 max-w-5xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSEO(!showSEO)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                showSEO ? "bg-[#84cc16] text-white shadow-sm" : "bg-[#f0f5e8] text-[#1a2e0a] hover:bg-[#e2edcf]"
              }`}
            >
              <Search className="h-3.5 w-3.5" /> SEO Lab
            </button>
            <div className="h-4 w-px bg-[#e2edcf]" />
            <div className="flex items-center gap-1.5 text-xs text-[#6b7f5e]">
              <div className={`h-2 w-2 rounded-full ${seo.score >= 70 ? "bg-[#84cc16]" : seo.score >= 40 ? "bg-amber-400" : "bg-red-400"}`} />
              SEO {seo.score}%
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="admin-btn-outline flex items-center gap-1.5 px-4 py-2 text-xs disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg bg-[#84cc16] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#65a30d] hover:shadow-md disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              {service ? "Update & Publish" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mx-auto mb-4 max-w-5xl rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>
        </div>
      )}
      {success && (
        <div className="mx-auto mb-4 max-w-5xl rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-green-700"><CheckCircle2 className="h-4 w-4" />{success}</div>
        </div>
      )}

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]">
        {/* ─── Main Content Column ─────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Title & Description */}
          <Section icon={FileText} title="Basic Information" subtitle="Title, slug, and description for this service" defaultOpen>
            <div className="space-y-4">
              <div>
                <label className="admin-label mb-1.5 block">Service Title <span className="text-red-400">*</span></label>
                <input
                  className="admin-input text-lg font-semibold"
                  placeholder="e.g. Web Design & Development"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="mt-1 text-[11px] text-[#6b7f5e]">{title.length} characters</p>
              </div>

              <div>
                <label className="admin-label mb-1.5 block">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-xs text-[#6b7f5e]">/services/</span>
                  <input
                    className="admin-input font-mono text-sm"
                    placeholder="auto-generated-from-title"
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
                  />
                </div>
                {!slugEdited && <p className="mt-1 text-[11px] text-[#6b7f5e]">Auto-generated from title</p>}
              </div>

              <div>
                <label className="admin-label mb-1.5 block">Short Description <span className="text-red-400">*</span></label>
                <textarea
                  className="admin-textarea !min-h-[5rem]"
                  placeholder="Brief description shown on the services card and page header..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
                <p className="mt-1 text-[11px] text-[#6b7f5e]">{description.length} characters — shown on service cards and page header</p>
              </div>
            </div>
          </Section>

          {/* Page Content */}
          <Section icon={Zap} title="Page Content" subtitle="Main body content of the service page" defaultOpen>
            <div>
              <label className="admin-label mb-1.5 block">Content <span className="text-red-400">*</span></label>
              <div className="border border-[#e2edcf] rounded-2xl bg-white">
                <RichTextEditor content={content} onChange={setContent} />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#6b7f5e]">
                <span>{seo.words} words</span>
                <span className={seo.words >= 300 ? "text-[#65a30d] font-medium" : ""}>
                  {seo.words >= 300 ? "✓ Good length" : `Need ${300 - seo.words} more words for SEO`}
                </span>
              </div>
            </div>
          </Section>

          {/* FAQs */}
          <Section icon={MessageSquare} title="FAQs" subtitle="Frequently asked questions for this service" count={faqs.length}>
            <div className="space-y-3">
              {faqs.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e2edcf] py-8">
                  <MessageSquare className="mb-2 h-8 w-8 text-[#c5e091]" />
                  <p className="text-sm text-[#6b7f5e]">No FAQs yet</p>
                  <p className="text-xs text-[#94a388]">Add FAQs to help customers find answers</p>
                </div>
              )}
              {faqs.map((faq, i) => (
                <div key={i} className="group relative rounded-xl border border-[#e2edcf] bg-white/70 p-4 transition-all hover:border-[#c5e091]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-[#f0f5e8] px-2 py-0.5 text-[10px] font-bold text-[#65a30d]">FAQ #{i + 1}</span>
                    <button onClick={() => removeFaq(i)} className="rounded-md p-1 text-[#6b7f5e] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <label className="admin-label mb-1 block text-[11px]">Question</label>
                  <input className="admin-input mb-3" placeholder="e.g. How much does it cost?" value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} />
                  <label className="admin-label mb-1 block text-[11px]">Answer</label>
                  <textarea className="admin-textarea !min-h-[4rem]" placeholder="Detailed answer..." value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={3} />
                </div>
              ))}
              <button onClick={addFaq} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c5e091] py-3 text-sm font-medium text-[#65a30d] transition-all hover:border-[#84cc16] hover:bg-[#84cc16]/5">
                <Plus className="h-4 w-4" /> Add FAQ
              </button>
            </div>
          </Section>

          {/* Testimonials */}
          <Section icon={Star} title="Testimonials" subtitle="Client reviews for this specific service" count={testimonials.length}>
            <div className="space-y-3">
              {testimonials.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e2edcf] py-8">
                  <Star className="mb-2 h-8 w-8 text-[#c5e091]" />
                  <p className="text-sm text-[#6b7f5e]">No testimonials yet</p>
                  <p className="text-xs text-[#94a388]">Add client reviews to build trust</p>
                </div>
              )}
              {testimonials.map((tm, i) => (
                <div key={i} className="group relative rounded-xl border border-[#e2edcf] bg-white/70 p-4 transition-all hover:border-[#c5e091]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-[#f0f5e8] px-2 py-0.5 text-[10px] font-bold text-[#65a30d]">Review #{i + 1}</span>
                    <button onClick={() => removeTestimonial(i)} className="rounded-md p-1 text-[#6b7f5e] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="admin-label mb-1 block text-[11px]">Name</label>
                      <input className="admin-input" placeholder="Client name" value={tm.name} onChange={(e) => updateTestimonial(i, "name", e.target.value)} />
                    </div>
                    <div>
                      <label className="admin-label mb-1 block text-[11px]">Role</label>
                      <input className="admin-input" placeholder="e.g. CEO" value={tm.role} onChange={(e) => updateTestimonial(i, "role", e.target.value)} />
                    </div>
                    <div>
                      <label className="admin-label mb-1 block text-[11px]">Company</label>
                      <input className="admin-input" placeholder="Company name" value={tm.company} onChange={(e) => updateTestimonial(i, "company", e.target.value)} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="admin-label mb-1 block text-[11px]">Testimonial</label>
                    <textarea className="admin-textarea !min-h-[4rem]" placeholder="What the client said..." value={tm.content} onChange={(e) => updateTestimonial(i, "content", e.target.value)} rows={3} />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="admin-label text-[11px]">Rating</label>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => updateTestimonial(i, "rating", star)} className={`h-5 w-5 transition-colors ${star <= tm.rating ? "text-[#84cc16]" : "text-[#e2edcf]"}`}>
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addTestimonial} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c5e091] py-3 text-sm font-medium text-[#65a30d] transition-all hover:border-[#84cc16] hover:bg-[#84cc16]/5">
                <Plus className="h-4 w-4" /> Add Testimonial
              </button>
            </div>
          </Section>

          {/* Projects Gallery */}
          <Section icon={Image} title="Project Gallery" subtitle="Showcase multiple project images and links for this service" count={projects.length}>
            <div className="space-y-3">
              {projects.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e2edcf] py-8">
                  <Image className="mb-2 h-8 w-8 text-[#c5e091]" />
                  <p className="text-sm text-[#6b7f5e]">No projects yet</p>
                  <p className="text-xs text-[#94a388]">Add multiple project links and images to showcase your work</p>
                </div>
              )}
              {projects.map((proj, i) => (
                <div key={i} className="group relative rounded-xl border border-[#e2edcf] bg-white/70 p-4 transition-all hover:border-[#c5e091]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-[#f0f5e8] px-2 py-0.5 text-[10px] font-bold text-[#65a30d]">Project #{i + 1}</span>
                    <button onClick={() => setProjects(projects.filter((_, idx) => idx !== i))} className="rounded-md p-1 text-[#6b7f5e] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="admin-label mb-1 block text-[11px]">Project Title <span className="text-red-400">*</span></label>
                      <input className="admin-input" placeholder="e.g. E-commerce Website" value={proj.title} onChange={(e) => { const c = [...projects]; c[i] = { ...c[i], title: e.target.value }; setProjects(c) }} />
                    </div>
                    <div>
                      <label className="admin-label mb-1 block text-[11px]">Project Link</label>
                      <input className="admin-input" placeholder="https://example.com" value={proj.link} onChange={(e) => { const c = [...projects]; c[i] = { ...c[i], link: e.target.value }; setProjects(c) }} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="admin-label mb-1 block text-[11px]">Description</label>
                    <textarea className="admin-textarea !min-h-[3rem]" placeholder="Brief project description..." value={proj.description} onChange={(e) => { const c = [...projects]; c[i] = { ...c[i], description: e.target.value }; setProjects(c) }} rows={2} />
                  </div>
                  <div className="mt-3">
                    <label className="admin-label mb-1 block text-[11px]">Project Image</label>
                    <div className="flex gap-2">
                      <input className="admin-input flex-1 text-sm" placeholder="Paste image URL or upload..." value={proj.image} onChange={(e) => { const c = [...projects]; c[i] = { ...c[i], image: e.target.value }; setProjects(c) }} />
                      <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e2edcf] bg-white/60 px-3 text-xs text-[#6b7f5e] transition-colors hover:border-[#84cc16] hover:text-[#65a30d]">
                        <Image className="h-3.5 w-3.5" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  const c = [...projects]
                                  c[i] = { ...c[i], image: reader.result as string }
                                  setProjects(c)
                                }
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                    </div>
                    {proj.image && (
                      <div className="mt-2 overflow-hidden rounded-lg border border-[#e2edcf]">
                        <img
                          src={proj.image.startsWith("data:") || proj.image.startsWith("http") ? proj.image : `/${proj.image}`}
                          alt={proj.title || `Project ${i + 1}`}
                          className="h-24 w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={() => setProjects([...projects, { title: "", description: "", image: "", link: "" }])} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c5e091] py-3 text-sm font-medium text-[#65a30d] transition-all hover:border-[#84cc16] hover:bg-[#84cc16]/5">
                <Plus className="h-4 w-4" /> Add Project
              </button>
            </div>
          </Section>

          {/* CTA Section */}
          <Section icon={Send} title="Call to Action" subtitle="Bottom CTA section shown on the service page">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="admin-label mb-1 block text-[11px]">CTA Heading</label>
                <input className="admin-input" placeholder="Ready to get started?" value={ctaHeading} onChange={(e) => setCtaHeading(e.target.value)} />
              </div>
              <div>
                <label className="admin-label mb-1 block text-[11px]">Button Text</label>
                <input className="admin-input" placeholder="Get Started" value={ctaButtonText} onChange={(e) => setCtaButtonText(e.target.value)} />
              </div>
            </div>
            <div className="mt-3">
              <label className="admin-label mb-1 block text-[11px]">CTA Description</label>
              <textarea className="admin-textarea !min-h-[3.5rem]" placeholder="A brief call-to-action description..." value={ctaDescription} onChange={(e) => setCtaDescription(e.target.value)} rows={2} />
            </div>
            <div className="mt-3">
              <label className="admin-label mb-1 block text-[11px]">Button Link</label>
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-[#6b7f5e]" />
                <input className="admin-input" placeholder="#contact or /contact" value={ctaButtonLink} onChange={(e) => setCtaButtonLink(e.target.value)} />
              </div>
            </div>
          </Section>
        </div>

        {/* ─── Sidebar ─────────────────────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-[140px] lg:self-start">
          {/* Publish Settings */}
          <div className="admin-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4 text-[#65a30d]" />
              <h3 className="text-sm font-bold text-[#1a2e0a]">Publish Settings</h3>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#e2edcf] bg-gradient-to-r from-[#f7faf3] to-white p-3.5">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${published ? "bg-[#84cc16]/15 text-[#65a30d]" : "bg-amber-500/10 text-amber-600"}`}>
                {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2e0a]">
                  {published ? "Published" : "Draft"}
                </p>
                <p className="text-[11px] text-[#6b7f5e]">
                  {published ? "Live on the website" : "Use “Publish” above to go live"}
                </p>
              </div>
              <div className={`ml-auto h-3 w-3 rounded-full ${published ? "bg-[#84cc16] shadow-[0_0_8px_rgba(132,204,22,0.4)]" : "bg-[#e2edcf]"}`} />
            </div>

            <div className="space-y-3">
              <div>
                <label className="admin-label mb-1.5 block text-[11px]">Icon</label>
                <select className="admin-input text-sm" value={icon} onChange={(e) => setIcon(e.target.value)}>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label mb-1.5 block text-[11px]">Display Order</label>
                <input className="admin-input text-sm" type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="admin-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-[#65a30d]" />
                <h3 className="text-sm font-bold text-[#1a2e0a]">Featured Image</h3>
              </div>
              {featuredImage && (
                <span className="flex items-center gap-1 rounded-full bg-[#84cc16]/10 px-2 py-0.5 text-[10px] font-bold text-[#65a30d]">
                  <CheckCircle2 className="h-3 w-3" /> Saved
                </span>
              )}
            </div>

            {/* Current image preview */}
            {featuredImage && (
              <div className="mb-3 overflow-hidden rounded-lg border border-[#e2edcf]">
                <img
                  src={featuredImage.startsWith("data:") || featuredImage.startsWith("http") ? featuredImage : `/${featuredImage}`}
                  alt="Featured image preview"
                  className="h-32 w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="admin-label mb-1.5 block text-[11px]">Image URL</label>
                <input
                  className="admin-input text-sm"
                  placeholder="https://example.com/image.jpg"
                  value={featuredImage.startsWith("data:") ? "" : featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                />
                {featuredImage.startsWith("data:") && (
                  <p className="mt-1 text-[11px] text-[#65a30d]">Image uploaded from device (base64)</p>
                )}
              </div>
              <div>
                <label className="admin-label mb-1.5 block text-[11px]">
                  {featuredImage ? "Change image" : "Upload from device"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full cursor-pointer rounded-lg border border-[#e2edcf] bg-white/60 px-3 py-2 text-sm text-[#6b7f5e] file:mr-3 file:rounded-md file:border-0 file:bg-[#84cc16]/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#65a30d] hover:border-[#84cc16] hover:file:bg-[#84cc16]/20"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                />
                {imageFileName && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[#65a30d]">
                    <CheckCircle2 className="h-3 w-3" /> Selected: {imageFileName}
                  </p>
                )}
              </div>
              {featuredImage && (
                <button
                  type="button"
                  onClick={() => { setFeaturedImage(""); setImageFileName("") }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-2 text-[11px] font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove Image
                </button>
              )}
            </div>

            {!featuredImage && (
              <div className="mt-3 flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-[#e2edcf]">
                <div className="text-center">
                  <Image className="mx-auto mb-1 h-5 w-5 text-[#c5e091]" />
                  <p className="text-[11px] text-[#94a388]">Paste a URL or upload from your device</p>
                </div>
              </div>
            )}
            <div className="mt-4">
              <label className="admin-label mb-1.5 block text-[11px]">Project Link</label>
              <input
                className="admin-input text-sm"
                placeholder="https://example.com/project"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
              />
              {projectLink && (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[#6b7f5e]">Click the image or button to open the project link.</span>
                  <a
                    href={projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#84cc16] px-3 py-2 text-[11px] font-semibold text-black transition hover:bg-[#a3e635]"
                  >
                    View Project
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* SEO Lab */}
          {showSEO && (
            <div className="admin-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#65a30d]" />
                <h3 className="text-sm font-bold text-[#1a2e0a]">SEO Lab</h3>
              </div>

              {/* Score Ring */}
              <div className="mb-5 flex items-center gap-4 rounded-xl border border-[#e2edcf] bg-gradient-to-r from-[#f7faf3] to-white p-4">
                <div className={`admin-seo-score-ring ${seo.score >= 70 ? "good" : seo.score >= 40 ? "ok" : "bad"}`}>
                  {seo.score}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a2e0a]">SEO Score</p>
                  <p className="text-xs text-[#6b7f5e]">
                    {seo.score >= 70 ? "Excellent — ready to publish" : seo.score >= 40 ? "Needs improvement" : "Incomplete — add more content"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="admin-label mb-1 block text-[11px]">SEO Title</label>
                  <input className="admin-input" placeholder="SEO title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                  <CharBar current={seoTitle.length} min={30} max={60} label="aim for 30-60 chars" />
                </div>

                <div>
                  <label className="admin-label mb-1 block text-[11px]">Meta Description</label>
                  <textarea className="admin-textarea !min-h-[3.5rem]" placeholder="SEO description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} />
                  <CharBar current={seoDescription.length} min={120} max={160} label="aim for 120-160 chars" />
                </div>

                <div>
                  <label className="admin-label mb-1 block text-[11px]">Keywords (comma-separated)</label>
                  <input className="admin-input" placeholder="web design, seo, marketing" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} />
                </div>

                <div>
                  <label className="admin-label mb-1 block text-[11px]">Canonical URL</label>
                  <input className="admin-input" placeholder="https://www.drillthru.tech/services/..." value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
                </div>

                <div>
                  <label className="admin-label mb-1 block text-[11px]">OG Image URL</label>
                  <input className="admin-input" placeholder="https://..." value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="admin-label mb-1 block text-[11px]">Twitter Card</label>
                    <select className="admin-input text-xs" value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)}>
                      <option value="summary_large_image">Large Image</option>
                      <option value="summary">Summary</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-label mb-1 block text-[11px]">Robots</label>
                    <select className="admin-input text-xs" value={robotsMeta} onChange={(e) => setRobotsMeta(e.target.value)}>
                      <option value="index,follow">index, follow</option>
                      <option value="noindex,follow">noindex, follow</option>
                      <option value="index,nofollow">index, nofollow</option>
                      <option value="noindex,nofollow">noindex, nofollow</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Google Preview */}
              <div className="mt-5">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#1a2e0a]">
                  <Eye className="h-3 w-3" /> Google Preview
                </p>
                <div className="rounded-lg border border-[#e2edcf] bg-white p-3">
                  <p className="truncate text-[13px] text-[#1a0dab]">{seoTitle || title || "Page Title"}</p>
                  <p className="truncate text-[11px] text-green-700">www.drillthru.tech/services/{slug || "your-service-slug"}</p>
                  <p className="line-clamp-2 text-[11px] text-[#4d5156]">{seoDescription || description || "Your meta description will appear here..."}</p>
                </div>
              </div>

              {seo.suggestions.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3">
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
                    <Info className="h-3.5 w-3.5" /> Suggestions
                  </div>
                  <ul className="space-y-1">
                    {seo.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] text-amber-600">
                        <span className="mt-0.5">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
