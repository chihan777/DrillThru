"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { Globe, Search, Megaphone, Palette, BarChart3, Zap, Target, MousePointerClick } from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "Web Design & Development",
    slug: "web-design-development",
    description: "Custom websites built for Nepali businesses. From stunning e-commerce stores to powerful web apps — fast, mobile-first designs that convert visitors into customers.",
    features: ["Responsive Design", "E-commerce Stores", "Custom Web Apps", "WordPress & CMS"],
  },
  {
    icon: Search,
    title: "SEO Services",
    slug: "seo-services",
    description: "Rank higher on Google and drive organic traffic. Data-driven SEO strategies proven to increase visibility, leads, and revenue for businesses across Nepal.",
    features: ["Technical SEO Audits", "Local SEO Nepal", "Content Strategy", "Link Building"],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    slug: "digital-marketing",
    description: "Full-service digital marketing that grows your brand. Social media management, content marketing, and email campaigns that engage and convert your audience.",
    features: ["Social Media Marketing", "Content Marketing", "Email Campaigns", "Influencer Marketing"],
  },
  {
    icon: MousePointerClick,
    title: "Google Ads Management",
    slug: "google-ads-management",
    description: "Get immediate, high-ROI results with expert Google Ads. Search, display, and shopping campaigns that generate qualified leads and sales.",
    features: ["Search Ads", "Display Network", "Shopping Ads", "Conversion Tracking"],
  },
  {
    icon: Target,
    title: "Meta Ads (Facebook & Instagram)",
    slug: "meta-ads-facebook-instagram",
    description: "Reach millions with targeted Facebook and Instagram ads. Scroll-stopping campaigns that build awareness, drive engagement, and generate sales.",
    features: ["Facebook Ads", "Instagram Ads", "Retargeting", "Lead Generation"],
  },
  {
    icon: Palette,
    title: "Brand Identity Design",
    slug: "brand-identity-design",
    description: "Stand out with a memorable brand identity. Professional logos, visual systems, and brand guidelines that build lasting customer trust.",
    features: ["Logo Design", "Visual Identity", "Brand Guidelines", "Rebranding"],
  },
  {
    icon: BarChart3,
    title: "Growth Strategy",
    slug: "growth-strategy",
    description: "Data-driven strategies to accelerate your growth. Market research, competitor analysis, and digital roadmaps for sustainable business expansion.",
    features: ["Market Research", "Competitor Analysis", "Growth Hacking", "KPI Tracking"],
  },
  {
    icon: Zap,
    title: "Website Performance",
    slug: "website-performance",
    description: "Make your website lightning-fast. Page speed, Core Web Vitals, and UX optimization that reduce bounce rates and increase conversions.",
    features: ["Speed Optimization", "Core Web Vitals", "UX Design", "A/B Testing"],
  },
]

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="services" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div ref={ref} className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-[#84cc16]">
            Our Services
          </span>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Web design, SEO &amp; marketing{" "}
            <span className="gradient-text">that delivers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            End-to-end digital solutions for businesses in Nepal — from professional website 
            design and development to SEO, Google Ads, Meta Ads, and digital marketing.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Link key={service.title} href={`/services/${service.slug}`} className="block">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-[#84cc16]/50 hover:bg-card/80"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative">
                {/* Icon */}
                <div className="mb-4 inline-flex rounded-xl bg-[#84cc16]/10 p-3">
                  <service.icon className="h-6 w-6 text-[#84cc16]" />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>

                {/* Description */}
                <p className="mb-4 text-sm text-muted-foreground">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-1">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1 w-1 rounded-full bg-[#84cc16]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
