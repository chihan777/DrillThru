import { redirect, notFound } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { ArrowLeft, Sparkles } from "lucide-react"
import { PostEditor } from "@/components/post-editor"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPost(id: number, userId: string) {
  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.id, id), eq(blogPosts.userId, userId)))
      .limit(1)
    return posts[0] || null
  } catch (error) {
    console.error("Failed to fetch post:", error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  return {
    title: "Edit Post | DrillThru Admin",
    description: "Edit your blog post",
  }
}

export default async function EditPostPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/admin/sign-in")
  }

  const { id } = await params
  const postId = parseInt(id, 10)

  if (isNaN(postId)) {
    notFound()
  }

  const post = await getPost(postId, session.user.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="admin-gradient-bg min-h-screen">
      {/* Header */}
      <header className="admin-card sticky top-4 z-30 mx-4 mt-4 p-0 lg:mx-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm font-medium text-[#6b7f5e] transition-colors hover:text-[#1a2e0a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#84cc16]">
              <span className="text-xs font-bold text-white">D</span>
            </div>
            <span className="font-bold tracking-tight text-[#1a2e0a]">
              DrillThru
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 lg:px-8">
        <div className="mx-auto mb-6 max-w-5xl">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#84cc16]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">
              Edit
            </span>
          </div>
          <h1 className="admin-heading text-2xl">Edit Post</h1>
          <p className="admin-muted mt-1 text-sm">
            Update your blog post and SEO metadata
          </p>
        </div>

        <PostEditor post={post} />
      </main>
    </div>
  )
}
