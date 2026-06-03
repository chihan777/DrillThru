import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | DrillThru",
  description: "Insights, tips, and strategies on web development, SEO, and digital marketing for businesses in Nepal.",
  openGraph: {
    title: "Blog | DrillThru",
    description: "Insights, tips, and strategies on web development, SEO, and digital marketing for businesses in Nepal.",
  },
}

async function getPublishedPosts() {
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt))
  } catch (error) {
    console.error("Failed to fetch published posts:", error)
    return []
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

function estimateReadTime(content: string) {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-[#84cc16]">
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                D
              </span>
            </div>
            <span className="text-lg font-bold tracking-tight">DrillThru</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-[#84cc16]">
            Our Blog
          </span>
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Insights & <span className="gradient-text">Strategies</span>
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            Expert insights on web development, SEO, and digital marketing tailored for the Nepali market.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <h2 className="mb-2 text-xl font-semibold">No posts yet</h2>
            <p className="text-muted-foreground">
              We&apos;re working on some great content. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-[#84cc16]/50 hover:shadow-lg hover:shadow-[#84cc16]/5"
              >
                {/* Cover Image Placeholder */}
                <div className="aspect-[16/9] bg-gradient-to-br from-secondary to-card">
                  <div className="flex h-full items-center justify-center text-6xl font-bold text-foreground/5">
                    0{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {estimateReadTime(post.content)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mb-2 text-xl font-semibold transition-colors group-hover:text-[#84cc16]">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-[#84cc16]">
                    Read Article
                    <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
