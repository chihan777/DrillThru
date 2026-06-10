import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Facebook, Linkedin } from "lucide-react"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq, and, ne, desc } from "drizzle-orm"
import type { Metadata } from "next"

export const revalidate = 86400 // 24 hours
export const dynamicParams = true // allow on-demand generation for newly published posts

export async function generateStaticParams() {
  const posts = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
  return posts.map((p) => ({ slug: p.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
      .limit(1)
    
    return posts[0] || null
  } catch (error) {
    console.error("Failed to fetch post:", error)
    return null
  }
}

async function getRelatedPosts(currentSlug: string) {
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.published, true), ne(blogPosts.slug, currentSlug)))
      .orderBy(desc(blogPosts.createdAt))
      .limit(3)
  } catch (error) {
    console.error("Failed to fetch related posts:", error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
    },
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(slug)

  // Create JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "DrillThru",
    },
    publisher: {
      "@type": "Organization",
      name: "DrillThru",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/blog" className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm">Back to Blog</span>
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

        <main className="mx-auto max-w-4xl px-6 py-16">
          {/* Article Header */}
          <header className="mb-12 text-center">
            {/* Meta */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {estimateReadTime(post.content)}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              {post.excerpt}
            </p>
          </header>

          {/* Cover Image Placeholder */}
          {post.coverImage && (
            <div className="mb-12 aspect-[2/1] overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-card" />
          )}

          {/* Article Content */}
          <article className="prose prose-invert mx-auto max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-[#84cc16] prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-[#84cc16] prose-pre:bg-card prose-pre:border prose-pre:border-border">
            {/* Render content - for now just paragraphs, can enhance with markdown parser later */}
            {post.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>

          {/* Share */}
          <div className="mt-12 flex items-center justify-center gap-4 border-t border-border pt-8">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Share2 className="h-4 w-4" />
              Share this article
            </span>
            <div className="flex gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://drillthru.tech/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-secondary p-2 text-muted-foreground transition-colors hover:bg-[#84cc16] hover:text-white"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://drillthru.tech/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-secondary p-2 text-muted-foreground transition-colors hover:bg-[#84cc16] hover:text-white"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://drillthru.tech/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-secondary p-2 text-muted-foreground transition-colors hover:bg-[#84cc16] hover:text-white"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </main>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-border bg-secondary/30 py-16">
            <div className="mx-auto max-w-7xl px-6">
              <h2 className="mb-8 text-center text-2xl font-bold">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-[#84cc16]/50"
                  >
                    <h3 className="mb-2 font-semibold transition-colors group-hover:text-[#84cc16]">
                      {relatedPost.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
