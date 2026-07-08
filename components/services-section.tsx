import Link from "next/link"
import { db } from "@/lib/db"
import { servicePages } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import {
  Globe, Search, Megaphone, Target, Palette, BarChart3, Zap, MousePointerClick,
  Code, Smartphone, ShoppingCart, Mail, Camera, Video, Pen, TrendingUp,
} from "lucide-react"

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
    .where(servicePages.published)
    .orderBy(asc(servicePages.order))
}

export async function ServicesSection() {
  const services = await getPublishedServices()

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-[#84cc16]">
            Our Services
          </span>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Web design, SEO &amp; marketing <span className="gradient-text">that delivers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            End-to-end digital solutions for businesses in Nepal — from professional website design and development to SEO, Google Ads, Meta Ads, and digital marketing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon] || Globe
            return (
              <Link key={service.id} href={`/services/${service.slug}`} className="block">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-[#84cc16]/50 hover:bg-card/80">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-xl bg-[#84cc16]/10 p-3">
                      <Icon className="h-6 w-6 text-[#84cc16]" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
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
