"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Users, Target, Award, Rocket } from "lucide-react"
import { SectionEyebrow } from "./section-eyebrow"

const ICON_MAP: Record<string, React.ElementType> = {
  Target, Users, Award, Rocket,
}

type Value = { id: number; icon: string; title: string; description: string; order: number }
type TeamMember = { id: number; name: string; role: string; initial: string; description: string | null; email: string | null; linkedin: string | null; github: string | null; image: string | null; order: number }

interface Props {
  settings: Record<string, string>
  values: Value[]
  team: TeamMember[]
}

const DEFAULT_SETTINGS: Record<string, string> = {
  heading: "believes in Nepal",
  subtitle: "Based in Kathmandu, we're a passionate team of developers, designers, and marketers dedicated to elevating Nepali businesses in the digital landscape.",
  storyHeading: "Our Story",
  storyP1: "DrillThru was born from a simple observation: Nepali businesses deserve world-class digital presence. Too often, we saw local companies struggling with outdated websites and invisible search rankings.",
  storyP2: "We started in 2022 with a mission to change that. Today, we've helped over 50 businesses across Nepal transform their digital presence and achieve remarkable growth.",
  storyP3: "Our name says it all — we drill through the noise, the competition, and the challenges to deliver results that matter.",
  teamHeading: "Meet the Team",
}

function normalizeImageSrc(src: string | null | undefined) {
  if (!src) return null
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src
  }
  return `/${src}`
}

export function AboutSectionClient({ settings: dbSettings, values, team }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const s = { ...DEFAULT_SETTINGS, ...dbSettings }

  return (
    <section id="about" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-[#84cc16]/5 blur-[150px]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center sm:mb-16"
        >
          <SectionEyebrow>About Us</SectionEyebrow>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            A team that{" "}
            <span className="gradient-text">{s.heading}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            {s.subtitle}
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20 grid gap-8 lg:grid-cols-2"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_10px_30px_-15px_rgba(0,0,0,0.6)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#84cc16]/10 blur-3xl" />
            <h3 className="relative mb-4 text-2xl font-bold tracking-tight">{s.storyHeading}</h3>
            <div className="relative space-y-4 leading-relaxed text-muted-foreground/90">
              {s.storyP1 && <p>{s.storyP1}</p>}
              {s.storyP2 && <p>{s.storyP2}</p>}
              {s.storyP3 && <p>{s.storyP3}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => {
              const Icon = ICON_MAP[value.icon] || Target
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="group rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#84cc16]/40 hover:shadow-[0_15px_35px_-20px_rgba(132,204,22,0.4)]"
                >
                  <div className="mb-3 inline-flex rounded-lg border border-[#84cc16]/20 bg-[#84cc16]/10 p-2.5 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-[#84cc16]" />
                  </div>
                  <h4 className="mb-1 font-semibold">{value.title}</h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Team */}
        {team.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="mb-8 text-center text-2xl font-bold">{s.teamHeading}</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="group text-center"
                >
                  <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#84cc16]/20 to-accent/20 shadow-lg transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#84cc16]/50 group-hover:shadow-[0_20px_40px_-20px_rgba(132,204,22,0.5)]">
                    <img
                      src={normalizeImageSrc(member.image) ?? "/placeholder-user.jpg"}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(event) => {
                        const target = event.currentTarget
                        if (target.src !== "/placeholder-user.jpg") {
                          target.src = "/placeholder-user.jpg"
                        }
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                  </div>
                  <h4 className="font-semibold transition-colors duration-300 group-hover:text-[#a3e635]">{member.name}</h4>
                  <p className="text-sm text-[#84cc16]/80">{member.role}</p>
                  {member.description && (
                    <p className="mt-1 text-xs text-muted-foreground/70">{member.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
