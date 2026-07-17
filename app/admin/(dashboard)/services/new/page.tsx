import { notFound } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { ArrowLeft, Sparkles } from "lucide-react"
import { ServiceEditor } from "@/components/service-editor"

export const metadata = {
  title: "New Service Page | DrillThru Admin",
  description: "Create a new service page",
}

export default async function NewServicePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    notFound()
  }

  return (
    <div className="admin-gradient-bg min-h-screen">
      <header className="admin-card sticky top-4 z-30 mx-4 mt-4 p-0 lg:mx-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/admin/services" className="flex items-center gap-2 text-sm font-medium text-[#6b7f5e] transition-colors hover:text-[#1a2e0a]">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
          <div className="flex items-center gap-2.5">
            <img src="/icon.jpeg" alt="DrillThru" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-bold tracking-tight text-[#1a2e0a]">DrillThru</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 lg:px-8">
        <div className="mx-auto mb-6 max-w-5xl">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#84cc16]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Create</span>
          </div>
          <h1 className="admin-heading text-2xl">Create New Service Page</h1>
          <p className="admin-muted mt-1 text-sm">Build a dynamic SEO-optimized service page with FAQs, testimonials, and CTA</p>
        </div>
        <ServiceEditor />
      </main>
    </div>
  )
}