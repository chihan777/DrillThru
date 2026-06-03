"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ExternalLink } from "lucide-react"

type Project = { id: number; title: string; category: string; description: string; image: string | null; link: string | null; color: string; order: number }

interface Props {
  projects: Project[]
  settings: Record<string, string>
}

const DEFAULT_SETTINGS: Record<string, string> = {
  workHeading: "Projects that speak for themselves",
  workSubtitle: "A showcase of our finest work for businesses across Nepal. Each project represents our commitment to excellence.",
}

function normalizeImageSrc(src: string | null | undefined) {
  if (!src) return null
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src
  }
  return `/${src}`
}

export function WorkSectionClient({ projects, settings: dbSettings }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const s = { ...DEFAULT_SETTINGS, ...dbSettings }

  if (projects.length === 0) return null

  return (
    <section id="work" className="relative overflow-hidden bg-secondary/30 py-24 md:py-32">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#84cc16]/5 blur-[150px]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-[#84cc16]">
            Our Work
          </span>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {s.workHeading.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="gradient-text">{s.workHeading.split(" ").slice(-2).join(" ")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {s.workSubtitle}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

              {/* Project image or placeholder */}
              {normalizeImageSrc(project.image) ? (
                <div className="absolute inset-0">
                  <img src={normalizeImageSrc(project.image)!} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`} />
              )}

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 grid-pattern opacity-20" />

              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Project Number */}
              <div className="absolute top-6 left-6 font-mono text-6xl font-bold text-white/10">
                0{index + 1}
              </div>

              {/* Content */}
              <motion.div
                animate={{
                  y: hoveredIndex === index ? 0 : 20,
                  opacity: hoveredIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col justify-end p-6"
              >
                <span className="mb-2 text-xs font-medium uppercase tracking-wider text-[#84cc16]">
                  {project.category}
                </span>
                <h3 className="mb-2 text-2xl font-bold text-white">{project.title}</h3>
                <p className="text-sm text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {project.description}
                </p>

                {/* Link Indicator */}
                {project.link && project.link !== "#" && project.link.startsWith("http") ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-[#84cc16] px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#65a30d] hover:shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Project
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <div className="mt-4 text-sm font-medium text-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View Case Study
                  </div>
                )}
              </motion.div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-[#84cc16]/0 transition-colors duration-300 group-hover:border-[#84cc16]/50" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
