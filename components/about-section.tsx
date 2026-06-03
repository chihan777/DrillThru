import { db } from "@/lib/db"
import { aboutSettings, aboutValues, aboutTeam } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { AboutSectionClient } from "./about-section-client"

const FALLBACK_VALUES = [
  { id: 1, icon: "Target", title: "Mission-Driven", description: "Every project starts with understanding your goals and delivering measurable results.", order: 1 },
  { id: 2, icon: "Award", title: "Quality First", description: "We never cut corners — clean code, modern design, and best practices always.", order: 2 },
  { id: 3, icon: "Users", title: "Client-Centric", description: "Your success is our success. We work as an extension of your team.", order: 3 },
  { id: 4, icon: "Rocket", title: "Innovation", description: "We stay ahead of trends so your business stays ahead of the competition.", order: 4 },
]

const FALLBACK_TEAM = [
  { id: 1, name: "Rajan Sharma", role: "Founder & Lead Developer", initial: "RS", description: "Full-stack developer with 5+ years building for the web.", email: null, linkedin: null, github: null, portfolio: null, image: null, order: 1 },
  { id: 2, name: "Sita Thapa", role: "UI/UX Designer", initial: "ST", description: "Crafts pixel-perfect interfaces that users love.", email: null, linkedin: null, github: null, portfolio: null, image: null, order: 2 },
  { id: 3, name: "Bikash Gurung", role: "Backend Engineer", initial: "BG", description: "Builds scalable APIs and database architectures.", email: null, linkedin: null, github: null, portfolio: null, image: null, order: 3 },
  { id: 4, name: "Anisha Karki", role: "Digital Marketer", initial: "AK", description: "SEO specialist driving organic growth for clients.", email: null, linkedin: null, github: null, portfolio: null, image: null, order: 4 },
]

export async function AboutSection() {
  let settingsRows: { key: string; value: string }[] = []
  let values: typeof FALLBACK_VALUES = []
  let team: typeof FALLBACK_TEAM = []

  try {
    ;[settingsRows, values, team] = await Promise.all([
      db.select().from(aboutSettings),
      db.select().from(aboutValues).orderBy(asc(aboutValues.order)),
      db.select().from(aboutTeam).orderBy(asc(aboutTeam.order)),
    ])
  } catch (error) {
    console.warn("⚠️  Database unavailable – using fallback about section data")
    values = FALLBACK_VALUES
    team = FALLBACK_TEAM
  }

  const settings: Record<string, string> = {}
  for (const row of settingsRows) {
    settings[row.key] = row.value
  }

  return (
    <AboutSectionClient
      settings={settings}
      values={values}
      team={team}
    />
  )
}
