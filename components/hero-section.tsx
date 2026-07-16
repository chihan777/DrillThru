"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      
      {/* Gradient Orbs */}
      <motion.div
        style={{ y }}
        className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#84cc16]/20 blur-[120px]"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]) }}
        className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#a3e635]/15 blur-[100px]"
      />

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-20 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-[#84cc16]" />
          <span className="text-muted-foreground">Nepal&apos;s Premier Web Design &amp; Digital Marketing Agency</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Web design &amp; development that{" "}
          <span className="gradient-text">drills through</span>{" "}
          the competition
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl"
        >
          Professional website design and development, SEO services, Google Ads, Meta Ads, 
          and digital marketing solutions that transform Nepali businesses into digital powerhouses.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="group bg-[#84cc16] px-8 font-semibold text-[#0a0a0a] shadow-lg shadow-[#84cc16]/25 transition-all hover:bg-[#a3e635] hover:shadow-xl hover:shadow-[#84cc16]/40"
          >
            <Link href="#contact">
              Start Your Project
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/15 bg-white/[0.02] px-8 backdrop-blur-sm transition-all hover:border-[#84cc16]/60 hover:bg-[#84cc16]/10"
          >
            <Link href="#work">View Our Work</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm sm:mt-20 sm:grid-cols-4"
        >
          {[
            { value: "50+", label: "Projects Delivered" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "3x", label: "Average ROI" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={index} className="bg-background/40 px-4 py-5 text-center transition-colors hover:bg-[#84cc16]/[0.06]">
              <div className="text-3xl font-bold text-[#84cc16] md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1"
        >
          <div className="h-2 w-1 rounded-full bg-[#84cc16]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
