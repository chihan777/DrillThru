import Link from "next/link"
import { db } from "@/lib/db"
import { servicePages } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import {
  Globe, Search, Megaphone, Target, Palette, BarChart3, Zap, MousePointerClick,
  Code, Smartphone, ShoppingCart, Mail, Camera, Video, Pen, TrendingUp, ArrowUpRight,
} from "lucide-react"
import { SectionEyebrow } from "./section-eyebrow"

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Search,
  Megaphone,
  Target,
  Palette,
  BarChart3,
  Zap,
  MousePointerClick,
  Code,
  Smartphone,
  ShoppingCart,
  Mail,
  Camera,
  Video,
  Pen,
  TrendingUp,
}

export const revalidate = 86400

async function getPublishedServices() {
  return await db
    .select({ id: servicePages.id, title: servicePages.title, description: servicePages.description, slug: servicePages.slug, icon: servicePages.icon })
    .from(servicePages)
    .where(eq(servicePages.published, true))
    .orderBy(asc(servicePages.order))
}

export async function ServicesSection() {
  const services = await getPublishedServices()

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center sm:mb-16">
          <SectionEyebrow>Our Services</SectionEyebrow>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Web design, SEO &amp; marketing <span className="gradient-text">that delivers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            End-to-end digital solutions for businesses in Nepal — from professional website design and development to SEO, Google Ads, Meta Ads, and digital marketing.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = ICON_MAP[service.icon] || Globe
            return (
              <Link key={service.id} href={`/services/${service.slug}`} className="group block focus-visible:outline-none">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_10px_30px_-15px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#84cc16]/40 group-hover:shadow-[0_1px_0_0_rgba(132,204,22,0.15)_inset,0_25px_55px_-20px_rgba(132,204,22,0.35)] group-focus-visible:ring-2 group-focus-visible:ring-[#84cc16]/60 sm:p-7">
                  {/* Top accent line — sweeps in on hover */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#84cc16] via-[#a3e635] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Hover wash */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#84cc16]/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Index watermark */}
                  <span className="pointer-events-none absolute -right-1 -top-3 select-none font-mono text-6xl font-black tracking-tighter text-white/[0.04] transition-colors duration-500 group-hover:text-[#84cc16]/10 sm:text-7xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex h-full flex-col">
                    {/* Icon + index row */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="inline-flex rounded-xl border border-[#84cc16]/20 bg-[#84cc16]/10 p-3 transition-all duration-300 group-hover:scale-110 group-hover:border-[#84cc16]/40 group-hover:bg-[#84cc16]/15">
                        <Icon className="h-6 w-6 text-[#84cc16]" />
                      </div>
                      <span className="font-mono text-xs font-semibold tracking-widest text-muted-foreground/50 transition-colors duration-300 group-hover:text-[#84cc16]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-[#a3e635] sm:text-xl">
                      {service.title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground/90">{service.description}</p>

                    {/* Footer link */}
                    <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-muted-foreground/60 transition-all duration-300 group-hover:gap-2.5 group-hover:text-[#a3e635]">
                      Learn more
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
