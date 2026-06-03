import { db } from "@/lib/db"
import { testimonials, aboutSettings } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { TestimonialsSectionClient } from "./testimonials-section-client"

const FALLBACK_TESTIMONIALS = [
  { id: 1, name: "Prakash Adhikari", role: "CEO", company: "NepalCrafts Pvt. Ltd.", content: "DrillThru transformed our online presence completely. Our e-commerce sales increased by 300% within six months of launching the new website.", rating: 5, image: null, order: 1 },
  { id: 2, name: "Maya Rai", role: "Founder", company: "Himalayan Trekkers", content: "The team understood our vision perfectly and delivered a website that truly represents the beauty of Nepal's tourism. Bookings are up 150%!", rating: 5, image: null, order: 2 },
  { id: 3, name: "Sandeep Joshi", role: "Marketing Director", company: "Kathmandu Foods", content: "Professional, responsive, and incredibly talented. Our SEO rankings went from page 5 to the top 3 results for our key search terms.", rating: 5, image: null, order: 3 },
]

export async function TestimonialsSection() {
  let rows: typeof FALLBACK_TESTIMONIALS = []
  let settingsRows: { key: string; value: string }[] = []

  try {
    ;[rows, settingsRows] = await Promise.all([
      db.select().from(testimonials).orderBy(asc(testimonials.order)),
      db.select().from(aboutSettings),
    ])
  } catch (error) {
    console.warn("⚠️  Database unavailable – using fallback testimonials")
    rows = FALLBACK_TESTIMONIALS
  }

  const settings: Record<string, string> = {}
  for (const row of settingsRows) {
    settings[row.key] = row.value
  }

  return <TestimonialsSectionClient testimonials={rows} settings={settings} />
}
