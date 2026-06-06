import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight, Star, ArrowRight, Home, Quote } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { db } from "@/lib/db"
import { servicePages, serviceFaqs, serviceTestimonials } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://drillthru.com"

async function getService(slug: string) {
  try {
    const rows = await db
      .select()
      .from(servicePages)
      .where(and(eq(servicePages.slug, slug), eq(servicePages.published, true)))
      .limit(1)
    if (!rows[0]) return null

    const [faqs, testimonials] = await Promise.all([
      db.select().from(serviceFaqs).where(eq(serviceFaqs.serviceId, rows[0].id)).orderBy(asc(serviceFaqs.order)),
      db.select().from(serviceTestimonials).where(eq(serviceTestimonials.serviceId, rows[0].id)).orderBy(asc(serviceTestimonials.order)),
    ])

    return { ...rows[0], faqs, testimonials }
  } catch (error) {
    console.warn("Failed to fetch service:", error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) return { title: "Service Not Found" }

  const url = `${SITE_URL}/services/${service.slug}`

  return {
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.description,
    keywords: service.seoKeywords || undefined,
    alternates: {
      canonical: service.canonicalUrl || url,
    },
    openGraph: {
      title: service.seoTitle || service.title,
      description: service.seoDescription || service.description,
      type: "website",
      url,
      ...(service.ogImage ? { images: [{ url: service.ogImage }] } : {}),
      siteName: "DrillThru",
      locale: "en_US",
    },
    twitter: {
      card: (service.twitterCard as "summary_large_image" | "summary") || "summary_large_image",
      title: service.seoTitle || service.title,
      description: service.seoDescription || service.description,
      ...(service.ogImage ? { images: [service.ogImage] } : {}),
    },
    robots: service.robotsMeta
      ? {
          index: service.robotsMeta.includes("index") && !service.robotsMeta.includes("noindex"),
          follow: service.robotsMeta.includes("follow") && !service.robotsMeta.includes("nofollow"),
        }
      : { index: true, follow: true },
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) notFound()

  // JSON-LD: Service schema
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "DrillThru",
      url: SITE_URL,
    },
    url: `${SITE_URL}/services/${service.slug}`,
    ...(service.featuredImage ? { image: service.featuredImage } : {}),
  }

  // JSON-LD: FAQ schema
  const faqJsonLd = service.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null

  // JSON-LD: Breadcrumb
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/#services` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${SITE_URL}/services/${service.slug}` },
    ],
  }

  return (
    <>
      {/* JSON-LD Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen bg-background pt-24">
        <Navigation />
        {/* Header */}
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/#services" className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm">Back to Services</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <img src="/icon.jpeg" alt="DrillThru" className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-lg font-bold tracking-tight">DrillThru</span>
            </Link>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="mx-auto max-w-4xl px-6 pt-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="flex items-center gap-1 transition-colors hover:text-foreground"><Home className="h-3.5 w-3.5" /> Home</Link></li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li><Link href="/#services" className="transition-colors hover:text-foreground">Services</Link></li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="text-foreground">{service.title}</li>
          </ol>
        </nav>

        <main className="mx-auto max-w-4xl px-6 py-12">
          {/* Hero */}
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-[#84cc16]">Our Service</span>
            <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">{service.title}</h1>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">{service.description}</p>
          </div>

          {/* Featured Image */}
          {service.featuredImage && (
            <div className="mb-12 overflow-hidden rounded-2xl border border-border">
              <a
                href={service.projectLink || `#services`}
                target={service.projectLink ? "_blank" : undefined}
                rel={service.projectLink ? "noopener noreferrer" : undefined}
                className={service.projectLink ? "block" : "pointer-events-none block"}
              >
                <img src={service.featuredImage} alt={service.title} className="w-full object-cover" />
              </a>
              {service.projectLink && (
                <div className="border-t border-border bg-background px-6 py-4 text-right">
                  <a
                    href={service.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#84cc16] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#a3e635]"
                  >
                    View Project
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <article className="prose prose-invert mx-auto mb-16 max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-[#84cc16] prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-[#84cc16] prose-pre:bg-card prose-pre:border prose-pre:border-border">
            {service.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>

          {/* FAQs */}
          {service.faqs.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {service.faqs.map((faq, i) => (
                  <details key={i} className="group rounded-xl border border-border bg-card transition-colors open:border-[#84cc16]/50">
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-left">
                      <span className="pr-4 font-semibold">{faq.question}</span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="border-t border-border px-5 pb-5 pt-4 text-muted-foreground">{faq.answer}</div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Testimonials */}
          {service.testimonials.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">What Our Clients Say</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {service.testimonials.map((tm, i) => (
                  <div key={i} className="relative rounded-xl border border-border bg-card p-6">
                    <Quote className="absolute top-4 right-4 h-8 w-8 text-[#84cc16]/20" />
                    <div className="mb-3 flex gap-1">
                      {[...Array(tm.rating)].map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-[#84cc16] text-[#84cc16]" />
                      ))}
                    </div>
                    <blockquote className="mb-4 text-sm text-muted-foreground">&ldquo;{tm.content}&rdquo;</blockquote>
                    <div>
                      <p className="font-semibold text-sm">{tm.name}</p>
                      <p className="text-xs text-muted-foreground">{tm.role}{tm.company ? `, ${tm.company}` : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="rounded-2xl border border-border bg-card p-8 text-center md:p-12">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">{service.ctaHeading || `Ready to get started with ${service.title}?`}</h2>
            {service.ctaDescription && <p className="mx-auto mb-6 max-w-xl text-muted-foreground">{service.ctaDescription}</p>}
            <Link
              href={service.ctaButtonLink?.startsWith("#") ? `/${service.ctaButtonLink}` : service.ctaButtonLink || "/"}
              className="inline-flex items-center gap-2 rounded-lg bg-[#84cc16] px-8 py-3 font-semibold text-black transition-all hover:bg-[#a3e635] hover:shadow-lg hover:shadow-[#84cc16]/20"
            >
              {service.ctaButtonText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
          <div className="mx-auto max-w-7xl px-6">
            <p>&copy; {new Date().getFullYear()} DrillThru. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
