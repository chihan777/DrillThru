"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"

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

function normalizeHref(link: string) {
  return link.startsWith("http") ? link : `https://${link}`
}

export function WorkSectionClient({ projects, settings: dbSettings }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const s = { ...DEFAULT_SETTINGS, ...dbSettings }

  if (projects.length === 0) return null

  return (
    <section id="work" className="relative overflow-hidden bg-secondary/30 py-20 sm:py-24 md:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#84cc16]/5 blur-[150px]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-5 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-wider text-[#84cc16] sm:text-sm">
            Our Work
          </span>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {s.workHeading.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="gradient-text">{s.workHeading.split(" ").slice(-2).join(" ")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            {s.workSubtitle}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:gap-8">
          {projects.map((project, index) => {
            const imageSrc = normalizeImageSrc(project.image)
            const hasLink = Boolean(project.link && project.link !== "#")

            const CardInner = (
              <>
                {/* Media */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[calc(1rem-1px)]">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover object-top brightness-[0.97] transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:brightness-100"
                    />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${project.color}`}>
                      <span className="grid-pattern absolute inset-0 opacity-20" aria-hidden />
                      <span className="relative text-5xl font-black text-white/80 sm:text-6xl">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Sheen on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />

                  {/* Category pill */}
                  <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#a3e635] shadow-sm backdrop-blur-md sm:text-[11px]">
                    {project.category}
                  </span>
                </div>

                {/* Content panel */}
                <div className="flex flex-1 flex-col border-t border-white/[0.06] p-5 sm:p-6">
                  <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-[#a3e635] sm:text-xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground/90">
                    {project.description}
                  </p>

                  <div className="mt-5 flex items-center">
                    {hasLink ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#84cc16]/25 bg-[#84cc16]/10 px-4 py-2 text-xs font-semibold text-[#a3e635] transition-all duration-300 group-hover:border-[#84cc16]/60 group-hover:bg-[#84cc16]/20 sm:text-sm">
                        View Project
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60 sm:text-sm">
                        Case study coming soon
                      </span>
                    )}
                  </div>
                </div>
              </>
            )

            const cardClass =
              "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_10px_30px_-15px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#84cc16]/40 hover:shadow-[0_1px_0_0_rgba(132,204,22,0.15)_inset,0_25px_55px_-20px_rgba(132,204,22,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84cc16]/60"

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.12 }}
              >
                {hasLink ? (
                  <a
                    href={normalizeHref(project.link!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                    aria-label={`View project: ${project.title}`}
                  >
                    {CardInner}
                  </a>
                ) : (
                  <div className={cardClass}>{CardInner}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
