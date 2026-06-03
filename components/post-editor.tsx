"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Send,
  Eye,
  EyeOff,
  Search,
  AlertCircle,
  CheckCircle2,
  Info,
  Type,
  FileText,
  Globe,
  Sparkles,
  Loader2,
} from "lucide-react"
import { createPost, updatePost } from "@/app/actions/blog"

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  metaTitle: string | null
  metaDescription: string | null
  published: boolean
}

interface PostEditorProps {
  post?: Post
}

interface SEOAnalysis {
  titleLength: number
  descLength: number
  hasTitle: boolean
  hasDesc: boolean
  hasContent: boolean
  contentWords: number
  score: number
  suggestions: string[]
}

function analyzeSEO(data: {
  title: string
  metaTitle: string
  metaDesc: string
  content: string
}): SEOAnalysis {
  const titleLength = data.metaTitle.length
  const descLength = data.metaDesc.length
  const contentWords = data.content
    .split(/\s+/)
    .filter((w) => w.length > 0).length

  const suggestions: string[] = []
  let score = 0

  // Title analysis
  if (!data.title) {
    suggestions.push("Add a post title")
  } else {
    score += 15
  }
  if (titleLength > 0 && titleLength < 30) {
    suggestions.push("Meta title is too short (aim for 50-60 characters)")
  } else if (titleLength > 60) {
    suggestions.push("Meta title may be truncated in search results (>60 chars)")
  } else if (titleLength >= 30) {
    score += 15
  }

  // Description analysis
  if (!data.metaDesc) {
    suggestions.push("Add a meta description for search engines")
  } else {
    score += 15
  }
  if (descLength > 0 && descLength < 70) {
    suggestions.push("Meta description is too short (aim for 120-160 characters)")
  } else if (descLength > 160) {
    suggestions.push("Meta description may be truncated (>160 chars)")
  } else if (descLength >= 70) {
    score += 15
  }

  // Content analysis
  if (!data.content) {
    suggestions.push("Add post content")
  } else {
    score += 15
  }
  if (contentWords < 300 && data.content) {
    suggestions.push("Content is thin — aim for at least 300 words for better SEO")
  } else if (contentWords >= 300) {
    score += 15
  }

  // Keyword in title
  if (data.title && data.title.length > 10) {
    score += 10
  }

  return {
    titleLength,
    descLength,
    hasTitle: !!data.title,
    hasDesc: !!data.metaDesc,
    hasContent: !!data.content,
    contentWords,
    score: Math.min(score, 100),
    suggestions,
  }
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSEO, setShowSEO] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [title, setTitle] = useState(post?.title ?? "")
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "")
  const [content, setContent] = useState(post?.content ?? "")
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "")
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? "")
  const [published, setPublished] = useState(post?.published ?? false)

  const seo = analyzeSEO({
    title,
    metaTitle,
    metaDesc: metaDescription,
    content,
  })

  // Auto-generate meta title from title if empty
  useEffect(() => {
    if (!metaTitle && title) {
      setMetaTitle(title)
    }
  }, [title, metaTitle])

  // Auto-generate meta description from excerpt if empty
  useEffect(() => {
    if (!metaDescription && excerpt) {
      setMetaDescription(excerpt)
    }
  }, [excerpt, metaDescription])

  const handleSubmit = useCallback(
    async (publish: boolean) => {
      setIsSubmitting(true)
      setError("")
      setSuccess("")

      if (!title.trim() || !excerpt.trim() || !content.trim()) {
        setError("Please fill in all required fields.")
        setIsSubmitting(false)
        return
      }

      const formData = new FormData()
      formData.append("title", title)
      formData.append("excerpt", excerpt)
      formData.append("content", content)
      formData.append("metaTitle", metaTitle || title)
      formData.append("metaDescription", metaDescription || excerpt)
      formData.append("published", String(publish))

      try {
        const result = post
          ? await updatePost(post.id, formData)
          : await createPost(formData)

        if (result.success) {
          setSuccess(
            publish
              ? "Post published successfully!"
              : post
                ? "Post updated!"
                : "Draft saved!"
          )
          if (!post && "id" in result && result.id) {
            router.push(`/admin/posts/${result.id}`)
          } else {
            router.refresh()
          }
        } else {
          setError(result.error || "Something went wrong.")
        }
      } catch {
        setError("Failed to save post. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [title, excerpt, content, metaTitle, metaDescription, post, router]
  )

  return (
    <div className="admin-gradient-bg">
      {/* Decorative Orbs */}
      <div className="admin-green-orb left-0 top-0 h-[400px] w-[400px]" />
      <div className="admin-green-orb -bottom-20 -right-20 h-[300px] w-[300px]" />

      <div className="relative z-10">
        {/* Toolbar */}
        <div className="admin-card sticky top-4 z-30 mx-auto mb-6 max-w-5xl p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSEO(!showSEO)}
                className={`admin-btn-outline flex items-center gap-1.5 px-3 py-1.5 text-sm ${
                  showSEO ? "!border-[#84cc16] !bg-[#84cc16]/10" : ""
                }`}
              >
                <Search className="h-4 w-4" />
                SEO
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`admin-btn-outline flex items-center gap-1.5 px-3 py-1.5 text-sm ${
                  showPreview ? "!border-[#84cc16] !bg-[#84cc16]/10" : ""
                }`}
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="admin-btn-outline flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="admin-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {post ? "Update & Publish" : "Publish"}
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="admin-card mx-auto mb-4 max-w-5xl border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        )}
        {success && (
          <div className="admin-card mx-auto mb-4 max-w-5xl border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </div>
          </div>
        )}

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Editor */}
          <div className="space-y-6">
            {/* Title */}
            <div className="admin-card p-6">
              <label className="admin-label mb-2 block">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                className="admin-input text-xl font-semibold"
                placeholder="Enter an engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="admin-muted mt-1.5 text-xs">
                {title.length}/100 characters
              </p>
            </div>

            {/* Content */}
            <div className="admin-card p-6">
              <label className="admin-label mb-2 block">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                className="admin-textarea"
                placeholder="Write your post content here... Use markdown-style paragraphs separated by blank lines."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
              />
              <div className="admin-muted mt-1.5 flex items-center justify-between text-xs">
                <span>{seo.contentWords} words</span>
                <span>~{Math.ceil(seo.contentWords / 200)} min read</span>
              </div>
            </div>

            {/* Excerpt */}
            <div className="admin-card p-6">
              <label className="admin-label mb-2 block">
                Excerpt / Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                className="admin-textarea !min-h-[5rem]"
                placeholder="A brief summary of your post..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={4}
              />
              <p className="admin-muted mt-1.5 text-xs">
                {excerpt.length}/300 characters — shown on blog listing
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="admin-card p-5">
              <h3 className="admin-heading mb-3 flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-[#84cc16]" />
                Publish Settings
              </h3>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e2edcf] bg-white/60 p-3 transition-colors hover:bg-[#84cc16]/5">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 accent-[#84cc16]"
                />
                <div>
                  <p className="text-sm font-medium text-[#1a2e0a]">
                    Publish immediately
                  </p>
                  <p className="text-xs text-[#6b7f5e]">
                    {published
                      ? "Post will be visible on the blog"
                      : "Save as draft — not visible on blog"}
                  </p>
                </div>
              </label>
            </div>

            {/* SEO Panel */}
            {showSEO && (
              <div className="admin-card p-5">
                <h3 className="admin-heading mb-3 flex items-center gap-2 text-base">
                  <Search className="h-4 w-4 text-[#84cc16]" />
                  SEO Optimization
                </h3>

                {/* SEO Score */}
                <div className="mb-4 flex items-center gap-4 rounded-lg border border-[#e2edcf] bg-white/60 p-3">
                  <div
                    className={`admin-seo-score-ring ${
                      seo.score >= 70
                        ? "good"
                        : seo.score >= 40
                          ? "ok"
                          : "bad"
                    }`}
                  >
                    {seo.score}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a2e0a]">
                      SEO Score
                    </p>
                    <p className="text-xs text-[#6b7f5e]">
                      {seo.score >= 70
                        ? "Great!"
                        : seo.score >= 40
                          ? "Needs work"
                          : "Incomplete"}
                    </p>
                  </div>
                </div>

                {/* Meta Title */}
                <label className="admin-label mb-1.5 block">Meta Title</label>
                <input
                  className="admin-input mb-1.5"
                  placeholder="SEO title for search engines"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
                <p className="admin-muted mb-4 text-xs">
                  {metaTitle.length}/60 —{" "}
                  {metaTitle.length > 60
                    ? "⚠️ May be truncated"
                    : metaTitle.length >= 30
                      ? "✓ Good length"
                      : "Too short"}
                </p>

                {/* Meta Description */}
                <label className="admin-label mb-1.5 block">
                  Meta Description
                </label>
                <textarea
                  className="admin-textarea !min-h-[4rem]"
                  placeholder="Brief description for search results"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                />
                <p className="admin-muted mb-4 text-xs">
                  {metaDescription.length}/160 —{" "}
                  {metaDescription.length > 160
                    ? "⚠️ May be truncated"
                    : metaDescription.length >= 120
                      ? "✓ Good length"
                      : "Too short"}
                </p>

                {/* Suggestions */}
                {seo.suggestions.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                      <Info className="h-3.5 w-3.5" />
                      SEO Suggestions
                    </div>
                    <ul className="space-y-1">
                      {seo.suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-xs text-amber-600"
                        >
                          <span className="mt-0.5">•</span>
                          {s}
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
                  <Eye className="h-4 w-4 text-[#84cc16]" />
                  Google Search Preview
                </h3>
                <div className="rounded-lg border border-[#e2edcf] bg-white p-3">
                  <p className="truncate text-sm text-[#1a0dab]">
                    {metaTitle || title || "Page Title"}
                  </p>
                  <p className="truncate text-xs text-green-700">
                    drillthru.com/blog/{post?.slug || "your-post-slug"}
                  </p>
                  <p className="line-clamp-2 text-xs text-[#4d5156]">
                    {metaDescription ||
                      excerpt ||
                      "Your meta description will appear here..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
