import { db } from "@/lib/db"
import { projects, aboutSettings } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { WorkSectionClient } from "./work-section-client"

const FALLBACK_PROJECTS = [
  { id: 1, title: "Himalayan E-Commerce", category: "Web Development", description: "A full-featured online marketplace connecting Nepali artisans with customers worldwide. Built with Next.js and Stripe integration.", image: null, link: "#", color: "from-blue-500/20 to-purple-500/20", order: 1 },
  { id: 2, title: "Namaste Finance App", category: "Mobile App", description: "Personal finance management app tailored for Nepali banking systems with real-time NPR exchange rates.", image: null, link: "#", color: "from-green-500/20 to-teal-500/20", order: 2 },
  { id: 3, title: "VisitNepal Portal", category: "UI/UX Design", description: "Tourism portal showcasing Nepal's destinations with immersive 3D maps and AI-powered trip planning.", image: null, link: "#", color: "from-orange-500/20 to-red-500/20", order: 3 },
  { id: 4, title: "KrishiConnect Platform", category: "Full Stack", description: "Connecting farmers directly to consumers, eliminating middlemen and ensuring fair prices for agricultural products.", image: null, link: "#", color: "from-lime-500/20 to-emerald-500/20", order: 4 },
]

export async function WorkSection() {
  let projectRows: typeof FALLBACK_PROJECTS = []
  let settingsRows: { key: string; value: string }[] = []

  try {
    ;[projectRows, settingsRows] = await Promise.all([
      db.select().from(projects).orderBy(asc(projects.order)),
      db.select().from(aboutSettings),
    ])
  } catch (error) {
    console.warn("⚠️  Database unavailable – using fallback project data")
    projectRows = FALLBACK_PROJECTS
  }

  const settings: Record<string, string> = {}
  for (const row of settingsRows) {
    settings[row.key] = row.value
  }

  return <WorkSectionClient projects={projectRows} settings={settings} />
}
