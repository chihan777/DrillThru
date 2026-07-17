import { notFound } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { servicePages, serviceFaqs, serviceTestimonials, serviceProjects } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { ArrowLeft, Sparkles } from "lucide-react"
import { ServiceEditor } from "@/components/service-editor"

export const metadata = {
  title: "Edit Service Page | DrillThru Admin",
  description: "Edit a service page",
}

interface PageProps {
  params: Promise<{ id: string }>
}

async function getServiceWithRelations(id: number) {
  const rows = await db
    .select()
    .from(servicePages)
    .where(eq(servicePages.id, id))
    .limit(1)

  if (!rows[0]) return null

  const [faqs, testimonials, projects] = await Promise.all([
    db.select().from(serviceFaqs).where(eq(serviceFaqs.serviceId, id)).orderBy(asc(serviceFaqs.order)),
    db.select().from(serviceTestimonials).where(eq(serviceTestimonials.serviceId, id)).orderBy(asc(serviceTestimonials.order)),
    db.select().from(serviceProjects).where(eq(serviceProjects.serviceId, id)).orderBy(asc(serviceProjects.order)),
  ])

  return { ...rows[0], faqs, testimonials, projects }
}

export default async function EditServicePage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    notFound()
  }

  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) notFound()

  const service = await getServiceWithRelations(id)
  if (!service) notFound()

  const serviceData = {
    id: service.id,
    title: service.title,
    slug: service.slug,
    description: service.description,
    content: service.content,
    icon: service.icon,
    featuredImage: service.featuredImage,
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription,
    seoKeywords: service.seoKeywords,
    canonicalUrl: service.canonicalUrl,
    ogImage: service.ogImage,
    twitterCard: service.twitterCard,
    robotsMeta: service.robotsMeta,
    ctaHeading: service.ctaHeading,
    ctaDescription: service.ctaDescription,
    ctaButtonText: service.ctaButtonText,
    ctaButtonLink: service.ctaButtonLink,
    projectLink: service.projectLink,
    published: service.published,
    order: service.order,
    faqs: service.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    testimonials: service.testimonials.map((t) => ({
      name: t.name,
      role: t.role,
      company: t.company || "",
      content: t.content,
      rating: t.rating,
    })),
    projects: service.projects.map((p) => ({
      title: p.title,
      description: p.description || "",
      image: p.image || "",
      link: p.link || "",
    })),
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
            <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Edit</span>
          </div>
          <h1 className="admin-heading text-2xl">Edit Service Page</h1>
          <p className="admin-muted mt-1 text-sm">
            Editing &ldquo;{service.title}&rdquo; — <span className="font-mono text-[#65a30d]">/services/{service.slug}</span>
          </p>
        </div>
        <ServiceEditor service={serviceData} />
      </main>
    </div>
  )
}
