"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Save, Send, Eye, EyeOff, Search, AlertCircle, CheckCircle2, Info,
  Globe, Sparkles, Loader2, Plus, Trash2, GripVertical, Star,
} from "lucide-react"
import { createService, updateService } from "@/app/actions/services"

interface FAQ { question: string; answer: string }
interface Testimonial { name: string; role: string; company: string; content: string; rating: number }

interface ServiceData {
  id: number
  title: string
  slug: string
  description: string
  content: string
  icon: string
  featuredImage: string | null
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
}

interface ServiceEditorProps {
  service?: ServiceData
}

const ICON_OPTIONS = [
  "Globe", "Search", "Megaphone", "Target", "Palette", "BarChart3", "Zap", "MousePointerClick",
  "Code", "Smartphone", "ShoppingCart", "Mail", "Camera", "Video", "Pen", "TrendingUp",
]

function analyzeSEO(data: { title: string; metaTitle: string; metaDesc: string; content: string }) {
  const titleLen = data.metaTitle.length
  const descLen = data.metaDesc.length
  const words = data.content.split(/\s+/).filter((w) => w.length > 0).length
  const suggestions: string[] = []
  let score = 0

  if (!data.title) suggestions.push("Add a service title")
  else score += 15
  if (titleLen >= 30 && titleLen <= 60) score += 15
  else if (titleLen > 0) suggestions.push("Meta title should be 30-60 characters")
  if (data.metaDesc) score += 15
  else suggestions.push("Add a meta description")
  if (descLen >= 120 && descLen <= 160) score += 15
  else if (descLen > 0) suggestions.push("Meta description should be 120-160 characters")
  if (data.content) score += 15
  if (words >= 300) score += 15
  else if (data.content) suggestions.push("Content should be at least 300 words for better SEO")
  if (data.title && data.title.length > 10) score += 10

  return { titleLen, descLen, words, score: Math.min(score, 100), suggestions }
}

export function ServiceEditor({ service }: ServiceEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSEO, setShowSEO] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [title, setTitle] = useState(service?.title ?? "")
  const [description, setDescription] = useState(service?.description ?? "")
  const [content, setContent] = useState(service?.content ?? "")
  const [icon, setIcon] = useState(service?.icon ?? "Globe")
  const [featuredImage, setFeaturedImage] = useState(service?.featuredImage ?? "")
  const [order, setOrder] = useState(service?.order ?? 0)
  const [published, setPublished] = useState(service?.published ?? false)

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

  const seo = analyzeSEO({ title, metaTitle: seoTitle, metaDesc: seoDescription, content })

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
      setError("Please fill in all required fields.")
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
    formData.append("faqs", JSON.stringify(faqs.filter((f) => f.question && f.answer)))
    formData.append("testimonials", JSON.stringify(testimonials.filter((t) => t.name && t.content)))

    try {
      const result = service
        ? await updateService(service.id, formData)
        : await createService(formData)

      if (result.success) {
        setSuccess(publish ? "Service published!" : service ? "Service updated!" : "Draft saved!")
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
  }, [title, description, content, icon, featuredImage, order, seoTitle, seoDescription, seoKeywords, canonicalUrl, ogImage, twitterCard, robotsMeta, ctaHeading, ctaDescription, ctaButtonText, ctaButtonLink, faqs, testimonials, published, service, router])

  return (
    <div className="admin-gradient-bg">
      <div className="admin-green-orb left-0 top-0 h-[400px] w-[400px]" />
      <div className="admin-green-orb -bottom-20 -right-20 h-[300px] w-[300px]" />

      <div className="relative z-10">
        {/* Toolbar */}
        <div className="admin-card sticky top-4 z-30 mx-auto mb-6 max-w-5xl p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSEO(!showSEO)} className={`admin-btn-outline flex items-center gap-1.5 px-3 py-1.5 text-sm ${showSEO ? "!border-[#84cc16] !bg-[#84cc16]/10" : ""}`}>
                <Search className="h-4 w-4" /> SEO
              </button>
              <button onClick={() => setShowPreview(!showPreview)} className={`admin-btn-outline flex items-center gap-1.5 px-3 py-1.5 text-sm ${showPreview ? "!border-[#84cc16] !bg-[#84cc16]/10" : ""}`}>
                <Eye className="h-4 w-4" /> Preview
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="admin-btn-outline flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-50">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Draft
              </button>
              <button onClick={() => handleSubmit(true)} disabled={isSubmitting} className="admin-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-50">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {service ? "Update & Publish" : "Publish"}
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="admin-card mx-auto mb-4 max-w-5xl border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-sm text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>
          </div>
        )}
        {success && (
          <div className="admin-card mx-auto mb-4 max-w-5xl border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" />{success}</div>
          </div>
        )}

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Editor */}
          <div className="space-y-6">
            {/* Title + Description */}
            <div className="admin-card p-6">
              <label className="admin-label mb-2 block">Service Title <span className="text-red-500">*</span></label>
              <input className="admin-input text-xl font-semibold" placeholder="e.g. Web Design & Development" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div className="mt-4">
                <label className="admin-label mb-2 block">Short Description <span className="text-red-500">*</span></label>
                <textarea className="admin-textarea !min-h-[5rem]" placeholder="Brief description shown on the services card and page header..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
            </div>

            {/* Rich Content */}
            <div className="admin-card p-6">
              <label className="admin-label mb-2 block">Page Content <span className="text-red-500">*</span></label>
              <textarea className="admin-textarea" placeholder="Write the full service page content. Separate paragraphs with blank lines..." value={content} onChange={(e) => setContent(e.target.value)} rows={16} />
              <div className="admin-muted mt-1.5 flex items-center justify-between text-xs">
                <span>{seo.words} words</span>
                <span>~{Math.ceil(seo.words / 200)} min read</span>
              </div>
            </div>

            {/* FAQs */}
            <div className="admin-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="admin-heading flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-[#84cc16]" /> FAQs
                </h3>
                <button onClick={addFaq} className="admin-btn-outline flex items-center gap-1 px-3 py-1.5 text-xs">
                  <Plus className="h-3 w-3" /> Add FAQ
                </button>
              </div>
              {faqs.length === 0 && <p className="text-sm text-[#6b7f5e]">No FAQs yet. Add your first FAQ above.</p>}
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="relative rounded-lg border border-[#e2edcf] bg-white/60 p-4">
                    <button onClick={() => removeFaq(i)} className="absolute top-3 right-3 text-[#6b7f5e] hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <label className="admin-label mb-1 block text-xs">Question</label>
                    <input className="admin-input mb-3" placeholder="e.g. How much does it cost?" value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} />
                    <label className="admin-label mb-1 block text-xs">Answer</label>
                    <textarea className="admin-textarea !min-h-[4rem]" placeholder="Detailed answer..." value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={3} />
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="admin-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="admin-heading flex items-center gap-2 text-base">
                  <Star className="h-4 w-4 text-[#84cc16]" /> Testimonials
                </h3>
                <button onClick={addTestimonial} className="admin-btn-outline flex items-center gap-1 px-3 py-1.5 text-xs">
                  <Plus className="h-3 w-3" /> Add Testimonial
                </button>
              </div>
              {testimonials.length === 0 && <p className="text-sm text-[#6b7f5e]">No testimonials yet. Add your first testimonial above.</p>}
              <div className="space-y-4">
                {testimonials.map((tm, i) => (
                  <div key={i} className="relative rounded-lg border border-[#e2edcf] bg-white/60 p-4">
                    <button onClick={() => removeTestimonial(i)} className="absolute top-3 right-3 text-[#6b7f5e] hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="admin-label mb-1 block text-xs">Name</label>
                        <input className="admin-input" placeholder="Client name" value={tm.name} onChange={(e) => updateTestimonial(i, "name", e.target.value)} />
                      </div>
                      <div>
                        <label className="admin-label mb-1 block text-xs">Role</label>
                        <input className="admin-input" placeholder="e.g. CEO" value={tm.role} onChange={(e) => updateTestimonial(i, "role", e.target.value)} />
                      </div>
                      <div>
                        <label className="admin-label mb-1 block text-xs">Company</label>
                        <input className="admin-input" placeholder="Company name" value={tm.company} onChange={(e) => updateTestimonial(i, "company", e.target.value)} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="admin-label mb-1 block text-xs">Testimonial</label>
                      <textarea className="admin-textarea !min-h-[4rem]" placeholder="What the client said..." value={tm.content} onChange={(e) => updateTestimonial(i, "content", e.target.value)} rows={3} />
                    </div>
                    <div className="mt-3">
                      <label className="admin-label mb-1 block text-xs">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => updateTestimonial(i, "rating", star)} className={`h-6 w-6 ${star <= tm.rating ? "text-[#84cc16]" : "text-[#e2edcf]"}`}>
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="admin-card p-6">
              <h3 className="admin-heading mb-4 flex items-center gap-2 text-base">
                <Send className="h-4 w-4 text-[#84cc16]" /> CTA Section
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-label mb-1 block text-xs">CTA Heading</label>
                  <input className="admin-input" placeholder="Ready to get started?" value={ctaHeading} onChange={(e) => setCtaHeading(e.target.value)} />
                </div>
                <div>
                  <label className="admin-label mb-1 block text-xs">CTA Button Text</label>
                  <input className="admin-input" placeholder="Get Started" value={ctaButtonText} onChange={(e) => setCtaButtonText(e.target.value)} />
                </div>
              </div>
              <div className="mt-4">
                <label className="admin-label mb-1 block text-xs">CTA Description</label>
                <textarea className="admin-textarea !min-h-[4rem]" placeholder="A brief call-to-action description..." value={ctaDescription} onChange={(e) => setCtaDescription(e.target.value)} rows={2} />
              </div>
              <div className="mt-4">
                <label className="admin-label mb-1 block text-xs">CTA Button Link</label>
                <input className="admin-input" placeholder="#contact or /contact" value={ctaButtonLink} onChange={(e) => setCtaButtonLink(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="admin-card p-5">
              <h3 className="admin-heading mb-3 flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-[#84cc16]" /> Settings
              </h3>
              <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border border-[#e2edcf] bg-white/60 p-3 transition-colors hover:bg-[#84cc16]/5">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-[#84cc16]" />
                <div>
                  <p className="text-sm font-medium text-[#1a2e0a]">Publish immediately</p>
                  <p className="text-xs text-[#6b7f5e]">{published ? "Visible on the website" : "Saved as draft"}</p>
                </div>
              </label>
              <div className="mt-3">
                <label className="admin-label mb-1 block text-xs">Icon</label>
                <select className="admin-input" value={icon} onChange={(e) => setIcon(e.target.value)}>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div className="mt-3">
                <label className="admin-label mb-1 block text-xs">Featured Image URL</label>
                <input className="admin-input" placeholder="https://..." value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} />
              </div>
              <div className="mt-3">
                <label className="admin-label mb-1 block text-xs">Display Order</label>
                <input className="admin-input" type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} />
              </div>
            </div>

            {/* SEO Panel */}
            {showSEO && (
              <div className="admin-card p-5">
                <h3 className="admin-heading mb-3 flex items-center gap-2 text-base">
                  <Search className="h-4 w-4 text-[#84cc16]" /> SEO Optimization
                </h3>
                <div className="mb-4 flex items-center gap-4 rounded-lg border border-[#e2edcf] bg-white/60 p-3">
                  <div className={`admin-seo-score-ring ${seo.score >= 70 ? "good" : seo.score >= 40 ? "ok" : "bad"}`}>{seo.score}</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a2e0a]">SEO Score</p>
                    <p className="text-xs text-[#6b7f5e]">{seo.score >= 70 ? "Great!" : seo.score >= 40 ? "Needs work" : "Incomplete"}</p>
                  </div>
                </div>

                <label className="admin-label mb-1.5 block">SEO Title</label>
                <input className="admin-input mb-1.5" placeholder="SEO title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                <p className="admin-muted mb-4 text-xs">{seoTitle.length}/60 — {seoTitle.length > 60 ? "May be truncated" : seoTitle.length >= 30 ? "Good length" : "Too short"}</p>

                <label className="admin-label mb-1.5 block">Meta Description</label>
                <textarea className="admin-textarea !min-h-[4rem]" placeholder="SEO description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} />
                <p className="admin-muted mb-4 text-xs">{seoDescription.length}/160 — {seoDescription.length > 160 ? "May be truncated" : seoDescription.length >= 120 ? "Good length" : "Too short"}</p>

                <label className="admin-label mb-1.5 block">Keywords (comma-separated)</label>
                <input className="admin-input mb-4" placeholder="web design, seo, marketing" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} />

                <label className="admin-label mb-1.5 block">Canonical URL</label>
                <input className="admin-input mb-4" placeholder="https://drillthru.com/services/..." value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />

                <label className="admin-label mb-1.5 block">OG Image URL</label>
                <input className="admin-input mb-4" placeholder="https://..." value={ogImage} onChange={(e) => setOgImage(e.target.value)} />

                <label className="admin-label mb-1.5 block">Twitter Card Type</label>
                <select className="admin-input mb-4" value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)}>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="summary">Summary</option>
                </select>

                <label className="admin-label mb-1.5 block">Robots Meta</label>
                <select className="admin-input mb-4" value={robotsMeta} onChange={(e) => setRobotsMeta(e.target.value)}>
                  <option value="index,follow">index, follow</option>
                  <option value="noindex,follow">noindex, follow</option>
                  <option value="index,nofollow">index, nofollow</option>
                  <option value="noindex,nofollow">noindex, nofollow</option>
                </select>

                {seo.suggestions.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                      <Info className="h-3.5 w-3.5" /> SEO Suggestions
                    </div>
                    <ul className="space-y-1">
                      {seo.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-amber-600">
                          <span className="mt-0.5">-</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Google Preview */}
            {showPreview && (
              <div className="admin-card p-5">
                <h3 className="admin-heading mb-3 flex items-center gap-2 text-base">
                  <Eye className="h-4 w-4 text-[#84cc16]" /> Google Search Preview
                </h3>
                <div className="rounded-lg border border-[#e2edcf] bg-white p-3">
                  <p className="truncate text-sm text-[#1a0dab]">{seoTitle || title || "Page Title"}</p>
                  <p className="truncate text-xs text-green-700">drillthru.com/services/{service?.slug || "your-service-slug"}</p>
                  <p className="line-clamp-2 text-xs text-[#4d5156]">{seoDescription || description || "Your meta description will appear here..."}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
