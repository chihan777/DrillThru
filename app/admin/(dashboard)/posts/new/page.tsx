import { notFound } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { ArrowLeft, Sparkles } from "lucide-react"
import { PostEditor } from "@/components/post-editor"

export const metadata = {
  title: "New Post | DrillThru Admin",
  description: "Create a new blog post",
}

export default async function NewPostPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
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
            <img src="/icon.jpeg" alt="DrillThru" className="h-8 w-8 rounded-lg object-cover" />
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
              Create
            </span>
          </div>
          <h1 className="admin-heading text-2xl">Create New Post</h1>
          <p className="admin-muted mt-1 text-sm">
            Write and publish a new blog post with SEO optimization
          </p>
        </div>

        <PostEditor />
      </main>
    </div>
  )
}
