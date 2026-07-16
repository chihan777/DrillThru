import { Sparkles } from "lucide-react"
import { AdminSettingsForm } from "@/components/admin-settings-form"
import { getSiteSettings } from "@/app/actions/settings"

export const metadata = {
  title: "Site Settings | DrillThru",
  description: "Manage contact info, footer, and quick enquiry settings",
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#84cc16]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#65a30d]">Admin</span>
        </div>
        <h1 className="admin-heading text-2xl sm:text-3xl">Site Settings</h1>
        <p className="admin-muted mt-1">Manage contact information, footer content, and quick enquiry settings</p>
      </div>
      <AdminSettingsForm settings={settings} />
    </>
  )
}
