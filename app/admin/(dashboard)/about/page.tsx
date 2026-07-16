import { Sparkles } from "lucide-react"
import { AdminAboutForm } from "@/components/admin-about-form"
import { getAboutSettings, getValues, getTeam, getTestimonials } from "@/app/actions/about"

export const metadata = {
  title: "Manage About Section | DrillThru",
  description: "Edit the about section content",
}

export default async function AdminAboutPage() {
  const [settings, values, team, testimonials] = await Promise.all([
    getAboutSettings(),
    getValues(),
    getTeam(),
    getTestimonials(),
  ])

  return (
    <>
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#84cc16]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Admin</span>
        </div>
        <h1 className="admin-heading text-2xl sm:text-3xl">About Section</h1>
        <p className="admin-muted mt-1">Manage your about page content — text, values, team members, and testimonials</p>
      </div>
      <AdminAboutForm settings={settings} values={values} team={team} testimonials={testimonials} />
    </>
  )
}
