import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft, ChevronRight, Star, ArrowRight, Home, Quote,
  Sparkles, MessageCircle, HelpCircle, Rocket, CheckCircle2,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { db } from "@/lib/db"
import { servicePages, serviceFaqs, serviceTestimonials, serviceProjects } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"
import type { Metadata } from "next"

export const revalidate = 86400 // 24 hours
export const dynamicParams = false

export async function generateStaticParams() {
  const rows = await db
    .select({ slug: servicePages.slug })
    .from(servicePages)
    .where(eq(servicePages.published, true))
  return rows.map((r) => ({ slug: r.slug }))
}

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

    const [faqs, testimonials, projects] = await Promise.all([
      db.select().from(serviceFaqs).where(eq(serviceFaqs.serviceId, rows[0].id)).orderBy(asc(serviceFaqs.order)),
      db.select().from(serviceTestimonials).where(eq(serviceTestimonials.serviceId, rows[0].id)).orderBy(asc(serviceTestimonials.order)),
      db.select().from(serviceProjects).where(eq(serviceProjects.serviceId, rows[0].id)).orderBy(asc(serviceProjects.order)),
    ])

    return { ...rows[0], faqs, testimonials, projects }
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
    alternates: { canonical: service.canonicalUrl || url },
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

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: { "@type": "Organization", name: "DrillThru", url: SITE_URL },
    url: `${SITE_URL}/services/${service.slug}`,
    ...(service.featuredImage ? { image: service.featuredImage } : {}),
  }

  const faqJsonLd = service.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen bg-background">
        <Navigation />

        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#84cc16]/5 blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#84cc16]/3 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 transition-colors hover:text-[#84cc16]">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/#services" className="transition-colors hover:text-[#84cc16]">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{service.title}</span>
            </nav>

            {/* Badge */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#84cc16]/10">
                <Sparkles className="h-4 w-4 text-[#84cc16]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#84cc16]">Our Service</span>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="gradient-text">{service.title}</span>
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              {service.description}
            </p>

            {/* Back link */}
            <div className="mt-8">
              <Link href="/#services" className="group inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-all hover:border-[#84cc16]/50 hover:text-foreground">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Services
              </Link>
            </div>
          </div>
        </section>

        {/* ── Content Section ── */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h2:md:text-3xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-[#84cc16] prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-[#84cc16] prose-pre:bg-card prose-pre:border prose-pre:border-border">
              {service.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          </div>
        </section>

        {/* ── Our Projects Section ── */}
        {service.projects && service.projects.length > 0 && (
          <section className="relative border-t border-border py-16 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#84cc16]/20 bg-[#84cc16]/5 px-4 py-1.5">
                  <Rocket className="h-4 w-4 text-[#84cc16]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#84cc16]">Portfolio</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Projects</h2>
                <p className="mt-3 text-muted-foreground">Real results we&apos;ve delivered for our clients</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {service.projects.map((proj: any, i: number) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl border border-[#84cc16]/20 bg-card transition-all duration-300 hover:border-[#84cc16]/50 hover:shadow-xl hover:shadow-[#84cc16]/5">
                    {proj.image && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold">{proj.title}</h3>
                      {proj.description && (
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{proj.description}</p>
                      )}
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-[#84cc16] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#a3e635] hover:shadow-lg hover:shadow-[#84cc16]/20"
                        >
                          View Project <ArrowRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQs Section ── */}
        {service.faqs.length > 0 && (
          <section className="relative border-t border-border py-16 md:py-20">
            <div className="mx-auto max-w-3xl px-6">
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#84cc16]/20 bg-[#84cc16]/5 px-4 py-1.5">
                  <HelpCircle className="h-4 w-4 text-[#84cc16]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#84cc16]">FAQ</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Frequently Asked Questions</h2>
                <p className="mt-3 text-muted-foreground">Everything you need to know about this service</p>
              </div>
              <div className="space-y-3">
                {service.faqs.map((faq, i) => (
                  <details key={i} className="group rounded-xl border border-border bg-card transition-all open:border-[#84cc16]/30 open:bg-[#84cc16]/[0.02]">
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]">
                      <span className="pr-4 font-semibold">{faq.question}</span>
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border transition-all group-open:border-[#84cc16] group-open:bg-[#84cc16]/10">
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-90 group-open:text-[#84cc16]" />
                      </div>
                    </summary>
                    <div className="border-t border-border px-5 pb-5 pt-4 leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Testimonials Section ── */}
        {service.testimonials.length > 0 && (
          <section className="relative border-t border-border py-16 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#84cc16]/20 bg-[#84cc16]/5 px-4 py-1.5">
                  <MessageCircle className="h-4 w-4 text-[#84cc16]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#84cc16]">Testimonials</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What Our Clients Say</h2>
                <p className="mt-3 text-muted-foreground">Don&apos;t just take our word for it</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {service.testimonials.map((tm, i) => (
                  <div key={i} className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-[#84cc16]/30">
                    <Quote className="absolute top-4 right-4 h-10 w-10 text-[#84cc16]/10" />
                    <div className="mb-4 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${s <= tm.rating ? "fill-[#84cc16] text-[#84cc16]" : "fill-border text-border"}`} />
                      ))}
                    </div>
                    <blockquote className="relative mb-6 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{tm.content}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3 border-t border-border pt-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#84cc16]/10 text-sm font-bold text-[#84cc16]">
                        {tm.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{tm.name}</p>
                        <p className="text-xs text-muted-foreground">{tm.role}{tm.company ? `, ${tm.company}` : ""}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA Section ── */}
        <section className="relative border-t border-border py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative overflow-hidden rounded-2xl border border-[#84cc16]/20 bg-gradient-to-br from-[#84cc16]/5 via-card to-[#84cc16]/[0.02] p-8 text-center md:p-14">
              {/* Decorative elements */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#84cc16]/5 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#84cc16]/5 blur-[80px]" />

              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#84cc16]/20 bg-[#84cc16]/10 px-4 py-1.5">
                  <Rocket className="h-4 w-4 text-[#84cc16]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#84cc16]">Get Started</span>
                </div>
                <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
                  {service.ctaHeading || `Ready to get started with ${service.title}?`}
                </h2>
                {service.ctaDescription && (
                  <p className="mx-auto mb-8 max-w-xl text-muted-foreground">{service.ctaDescription}</p>
                )}
                {!service.ctaDescription && (
                  <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                    Let&apos;s discuss how our {service.title.toLowerCase()} services can help your business grow.
                  </p>
                )}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href={service.ctaButtonLink?.startsWith("#") ? `/${service.ctaButtonLink}` : service.ctaButtonLink || "/"}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#84cc16] px-8 py-3.5 font-semibold text-black shadow-lg shadow-[#84cc16]/20 transition-all hover:bg-[#a3e635] hover:shadow-xl hover:shadow-[#84cc16]/30"
                  >
                    {service.ctaButtonText}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/#services"
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 text-sm font-medium text-muted-foreground transition-all hover:border-[#84cc16]/50 hover:text-foreground"
                  >
                    Explore All Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-border py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Link href="/" className="flex items-center gap-2">
                <img src="/icon.jpeg" alt="DrillThru" className="h-8 w-8 rounded-lg object-cover" />
                <span className="text-lg font-bold tracking-tight">DrillThru</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} DrillThru. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
                <Link href="/#services" className="transition-colors hover:text-foreground">Services</Link>
                <Link href="/#about" className="transition-colors hover:text-foreground">About</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}