"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Users, Target, Award, Rocket, Mail, Linkedin, Github } from "lucide-react"

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
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-[#84cc16]">
            About Us
          </span>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            A team that{" "}
            <span className="gradient-text">{s.heading}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
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
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="mb-4 text-2xl font-bold">{s.storyHeading}</h3>
            <div className="space-y-4 text-muted-foreground">
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
                  className="rounded-xl border border-border bg-card/50 p-4 transition-colors hover:bg-card"
                >
                  <Icon className="mb-2 h-6 w-6 text-[#84cc16]" />
                  <h4 className="mb-1 font-semibold">{value.title}</h4>
                  <p className="text-xs text-muted-foreground">{value.description}</p>
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
                  <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#84cc16]/20 to-accent/20">
                    <img
                      src={normalizeImageSrc(member.image) ?? "/placeholder-user.jpg"}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        const target = event.currentTarget
                        if (target.src !== "/placeholder-user.jpg") {
                          target.src = "/placeholder-user.jpg"
                        }
                      }}
                    />
                    {/* Social overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-[#84cc16]" onClick={(e) => e.stopPropagation()}>
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-[#84cc16]" onClick={(e) => e.stopPropagation()}>
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.github && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-[#84cc16]" onClick={(e) => e.stopPropagation()}>
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
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
