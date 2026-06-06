import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import {
  Plus,
  FileText,
  Eye,
  EyeOff,
  Calendar,
  LayoutDashboard,
  Users,
  Sparkles,
  TrendingUp,
  Briefcase,
  MessageSquare,
  Settings,
  Activity,
  ShieldCheck,
} from "lucide-react"
import { AdminPostActions } from "@/components/admin-post-actions"
import { SignOutButton } from "@/components/sign-out-button"

export const metadata = {
  title: "Admin Dashboard | DrillThru",
  description: "Manage your blog posts",
}

async function getUserPosts(userId: string) {
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.userId, userId))
      .orderBy(desc(blogPosts.createdAt))
  } catch (error) {
    console.error("Failed to fetch user posts:", error)
    return []
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/admin/sign-in")
  }

  const posts = await getUserPosts(session.user.id)
  const publishedCount = posts.filter((p) => p.published).length
  const draftCount = posts.filter((p) => !p.published).length

  return (
    <div className="admin-gradient-bg relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="admin-green-orb -right-32 -top-32 h-[500px] w-[500px]" />
      <div className="admin-green-orb -left-24 bottom-0 h-[400px] w-[400px]" />

      {/* Sidebar */}
      <aside className="admin-sidebar fixed left-0 top-0 z-40 h-screen w-64">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/icon.jpeg" alt="DrillThru" className="h-9 w-9 rounded-lg object-cover" />
              <span className="font-bold tracking-tight text-white">
                DrillThru
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg bg-[#84cc16]/15 px-3 py-2.5 text-sm font-medium text-[#a3e635]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/about"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Users className="h-4 w-4" />
              About Section
            </Link>
            <Link
              href="/admin/services"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Briefcase className="h-4 w-4" />
              Services
            </Link>
            <Link
              href="/admin/enquiries"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <MessageSquare className="h-4 w-4" />
              Enquiries
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Site Settings
            </Link>
            <Link
              href="/admin/activity"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Activity className="h-4 w-4" />
              Activity Log
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" />
              Users & Sessions
            </Link>
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </nav>

          {/* User */}
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#84cc16]/20 text-sm font-bold text-[#a3e635]">
                {session.user.name?.charAt(0) ||
                  session.user.email?.charAt(0) ||
                  "A"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {session.user.name || "Admin"}
                </p>
                <p className="truncate text-xs text-white/40">
                  {session.user.email}
                </p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 pl-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#84cc16]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">
                  Admin
                </span>
              </div>
              <h1 className="admin-heading text-3xl">Dashboard</h1>
              <p className="admin-muted mt-1">
                Manage your blog posts and SEO performance
              </p>
            </div>
            <Link
              href="/admin/posts/new"
              className="admin-btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="admin-stat-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#84cc16]/10">
                  <FileText className="h-6 w-6 text-[#65a30d]" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a2e0a]">
                    {posts.length}
                  </p>
                  <p className="text-sm text-[#6b7f5e]">Total Posts</p>
                </div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Eye className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a2e0a]">
                    {publishedCount}
                  </p>
                  <p className="text-sm text-[#6b7f5e]">Published</p>
                </div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                  <EyeOff className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1a2e0a]">
                    {draftCount}
                  </p>
                  <p className="text-sm text-[#6b7f5e]">Drafts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Table */}
          <div className="admin-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2edcf] px-6 py-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#84cc16]" />
                <h2 className="font-semibold text-[#1a2e0a]">All Posts</h2>
              </div>
              <span className="admin-green-badge">{posts.length} total</span>
            </div>
            {posts.length === 0 ? (
              <div className="p-14 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#84cc16]/10">
                  <FileText className="h-8 w-8 text-[#84cc16]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#1a2e0a]">
                  No posts yet
                </h3>
                <p className="mb-6 text-sm text-[#6b7f5e]">
                  Create your first blog post to get started
                </p>
                <Link
                  href="/admin/posts/new"
                  className="admin-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Create Post
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#e2edcf]">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#84cc16]/[0.04]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="truncate font-medium text-[#1a2e0a]">
                          {post.title}
                        </h3>
                        {post.published ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-4 text-xs text-[#6b7f5e]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="rounded bg-[#84cc16]/8 px-2 py-0.5 font-mono text-[#65a30d]">
                          /blog/{post.slug}
                        </span>
                      </div>
                    </div>
                    <AdminPostActions post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
