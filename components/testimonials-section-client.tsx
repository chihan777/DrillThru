"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { SectionEyebrow } from "./section-eyebrow"

type Testimonial = {
  id: number
  name: string
  role: string
  company: string | null
  content: string
  rating: number
  image: string | null
  order: number
}

interface Props {
  testimonials: Testimonial[]
  settings: Record<string, string>
}

const DEFAULT_SETTINGS: Record<string, string> = {
  testimonialHeading: "Trusted by businesses across Nepal",
}

function normalizeImageSrc(src: string | null | undefined) {
  if (!src) return null
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src
  }
  return `/${src}`
}

export function TestimonialsSectionClient({ testimonials: items, settings: dbSettings }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)
  const s = { ...DEFAULT_SETTINGS, ...dbSettings }

  if (items.length === 0) return null

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const headingParts = s.testimonialHeading.split(" ")
  const lastTwoWords = headingParts.slice(-2).join(" ")
  const restWords = headingParts.slice(0, -2).join(" ")

  return (
    <section id="testimonials" className="relative overflow-hidden bg-secondary/30 py-24 md:py-32">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#84cc16]/5 blur-[150px]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center sm:mb-16"
        >
          <SectionEyebrow>Testimonials</SectionEyebrow>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {restWords}{" "}
            <span className="gradient-text">{lastTwoWords}</span>
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Quote Icon */}
          <Quote className="absolute -top-5 left-2 h-16 w-16 fill-[#84cc16]/10 text-[#84cc16]/25" />

          {/* Testimonial Content */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_20px_50px_-25px_rgba(0,0,0,0.7)] md:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#84cc16]/10 blur-3xl" />
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stars */}
              <div className="mb-6 flex gap-1">
                {[...Array(items[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#84cc16] text-[#84cc16]" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-8 text-lg text-foreground md:text-xl lg:text-2xl">
                &ldquo;{items[activeIndex].content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {normalizeImageSrc(items[activeIndex].image) ? (
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-[#84cc16]/20">
                    <img src={normalizeImageSrc(items[activeIndex].image)!} alt={items[activeIndex].name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#84cc16]/20 text-lg font-bold text-[#84cc16]">
                    {items[activeIndex].name.split(" ").map((n) => n[0]).join("")}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{items[activeIndex].name}</div>
                  <div className="text-sm text-muted-foreground">
                    {items[activeIndex].role}
                    {items[activeIndex].company ? `, ${items[activeIndex].company}` : ""}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="rounded-full border border-white/10 bg-white/[0.02] p-3 text-muted-foreground transition-all hover:border-[#84cc16]/50 hover:bg-[#84cc16]/10 hover:text-[#a3e635]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-6 bg-[#84cc16]"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="rounded-full border border-white/10 bg-white/[0.02] p-3 text-muted-foreground transition-all hover:border-[#84cc16]/50 hover:bg-[#84cc16]/10 hover:text-[#a3e635]"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
