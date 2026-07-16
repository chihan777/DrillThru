import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft, ChevronRight, Star, ArrowRight, Home, Quote,
  Sparkles, MessageCircle, HelpCircle, Rocket, CheckCircle2,
  Globe, Search, Megaphone, Target, Palette, BarChart3, Zap, MousePointerClick,
  Code, Smartphone, ShoppingCart, Mail, Camera, Video, Pen, TrendingUp,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { SectionEyebrow } from "@/components/section-eyebrow"

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Search, Megaphone, Target, Palette, BarChart3, Zap, MousePointerClick,
  Code, Smartphone, ShoppingCart, Mail, Camera, Video, Pen, TrendingUp,
}
import { db } from "@/lib/db"
import { servicePages, serviceFaqs, serviceTestimonials, serviceProjects, siteSettings } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"
import type { Metadata } from "next"
import { applyWordReplacements } from "@/lib/word-replacements"
import ReactMarkdown from "react-markdown"
import { SanitizedHTML } from "@/components/editor/sanitized-html"
import { findStaticServiceBySlug, serviceCards } from "@/lib/service-data"

export const revalidate = 86400 // 24 hours
export const dynamic = "force-dynamic" // prevent build-time DB reads
export const dynamicParams = true // allow on-demand generation for newly published services

// Avoid querying the DB during `next build` when DATABASE_URL is not configured.
export async function generateStaticParams() {
  return serviceCards.map((s) => ({ slug: s.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.drillthru.tech"

async function getService(slug: string) {
  try {
    const rows = await db
      .select()
      .from(servicePages)
      .where(and(eq(servicePages.slug, slug), eq(servicePages.published, true)))
      .limit(1)

    if (!rows[0]) {
      // Fallback to static service data
      const staticService = findStaticServiceBySlug(slug)
      if (!staticService) return null

      return {
        id: 0,
        userId: "",
        title: staticService.title,
        slug: staticService.slug,
        description: staticService.description,
        featuredImage: null,
        projectLink: null,
        content: staticService.pageContent,
        icon: "Globe",
        seoTitle: null,
        seoDescription: null,
        seoKeywords: null,
        canonicalUrl: null,
        ogImage: null,
        twitterCard: "summary_large_image",
        robotsMeta: "index,follow",
        ctaHeading: staticService.ctaHeading || null,
        ctaDescription: staticService.ctaDescription || null,
        ctaButtonText: staticService.ctaButtonText || "Get Started",
        ctaButtonLink: staticService.ctaButtonLink || "#contact",
        published: true,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        faqs: (staticService.faqs || []).map((f, i) => ({ id: i, serviceId: 0, question: f.question, answer: f.answer, order: i })),
        testimonials: (staticService.testimonials || []).map((t, i) => ({ id: i, serviceId: 0, name: t.name, role: t.role, company: t.company || null, content: t.content, rating: t.rating, order: i })),
        projects: (staticService.projects || []).map((p, i) => ({ id: i, serviceId: 0, title: p.title, description: p.description || null, image: p.image || null, link: p.link || null, order: i })),
      }
    }

    const [faqs, testimonials, projects, settingsRows] = await Promise.all([
      db.select().from(serviceFaqs).where(eq(serviceFaqs.serviceId, rows[0].id)).orderBy(asc(serviceFaqs.order)),
      db.select().from(serviceTestimonials).where(eq(serviceTestimonials.serviceId, rows[0].id)).orderBy(asc(serviceTestimonials.order)),
      db.select().from(serviceProjects).where(eq(serviceProjects.serviceId, rows[0].id)).orderBy(asc(serviceProjects.order)),
      db.select().from(siteSettings).where(eq(siteSettings.key, "globalWordReplacements")),
    ])

    const replacementsJson = settingsRows[0]?.value || "[]"
    const apply = (text: string) => applyWordReplacements(text, replacementsJson)
    const content = apply(rows[0].content)

    return {
      ...rows[0],
      title: apply(rows[0].title),
      description: apply(rows[0].description),
      content,
      ctaHeading: rows[0].ctaHeading ? apply(rows[0].ctaHeading) : null,
      ctaDescription: rows[0].ctaDescription ? apply(rows[0].ctaDescription) : null,
      ctaButtonText: rows[0].ctaButtonText ? apply(rows[0].ctaButtonText) : "Get Started",
      ctaButtonLink: rows[0].ctaButtonLink || "#contact",
      faqs: faqs.map(f => ({ ...f, question: apply(f.question), answer: apply(f.answer) })),
      testimonials: testimonials.map(t => ({ ...t, content: apply(t.content) })),
      projects,
    }
  } catch (error) {
    console.warn("Failed to fetch service from DB:", error)
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
        <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#84cc16]/5 blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#84cc16]/3 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 transition-colors hover:text-[#84cc16]">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/#services" className="transition-colors hover:text-[#84cc16]">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="max-w-[50vw] truncate text-foreground sm:max-w-none">{service.title}</span>
            </nav>

            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Text column */}
              <div>
                <SectionEyebrow>Our Service</SectionEyebrow>

                <h1 className="mb-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                  <span className="gradient-text">{service.title}</span>
                </h1>

                <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {service.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="#contact"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#84cc16] px-6 py-3 font-semibold text-[#0a0a0a] shadow-lg shadow-[#84cc16]/20 transition-all hover:bg-[#a3e635] hover:shadow-xl hover:shadow-[#84cc16]/30"
                  >
                    Get a Free Quote
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/#services"
                    className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.02] px-5 py-3 text-sm text-muted-foreground transition-all hover:border-[#84cc16]/50 hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    All Services
                  </Link>
                </div>
              </div>

              {/* Visual column */}
              <div className="relative mx-auto w-full max-w-md lg:mx-0">
                <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[#84cc16]/10 blur-3xl" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#84cc16]/15 via-card to-[#84cc16]/[0.03] shadow-2xl">
                  <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden />
                  {service.featuredImage ? (
                    <img
                      src={service.featuredImage.startsWith("http") || service.featuredImage.startsWith("data:") || service.featuredImage.startsWith("/") ? service.featuredImage : `/${service.featuredImage}`}
                      alt={service.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {(() => {
                        const Icon = ICON_MAP[service.icon] || Sparkles
                        return (
                          <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-[#84cc16]/20 bg-[#84cc16]/10 text-[#84cc16] shadow-lg shadow-[#84cc16]/10 backdrop-blur-sm">
                            <Icon className="h-14 w-14" />
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Content Section ── */}
        <section className="relative border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
            <div className="service-article prose prose-invert prose-lg mx-auto max-w-none text-left prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-2xl prose-h2:md:text-3xl prose-h3:mt-10 prose-h3:text-xl prose-p:text-[15px] prose-p:leading-8 prose-p:text-muted-foreground md:prose-p:text-base prose-a:text-[#84cc16] prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-[#84cc16] prose-pre:bg-card prose-pre:border prose-pre:border-border prose-blockquote:border-l-2 prose-blockquote:border-[#84cc16]/40 prose-blockquote:bg-[#111827]/80 prose-blockquote:px-6 prose-blockquote:py-4 prose-img:rounded-2xl prose-img:border prose-img:border-border">
              {service.content.trim().startsWith("<") ? (
                <SanitizedHTML html={service.content} />
              ) : (
                <ReactMarkdown>{service.content.replace(/\bnofollow\b\s*/gi, '').replace(/\s+/g, ' ')}</ReactMarkdown>
              )}
            </div>
          </div>
        </section>



        {/* ── FAQs Section ── */}
        {service.faqs.length > 0 && (
          <section className="relative border-t border-border py-14 md:py-16">
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
          <section className="relative border-t border-border py-14 md:py-16">
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
        <section className="relative border-t border-border py-14 md:py-16">
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