import { getSiteSettings } from "@/app/actions/settings"
import { QuickContactClient } from "./quick-contact-client"

export async function QuickContact() {
  const settings = await getSiteSettings()

  return (
    <QuickContactClient
      phone={settings.contactPhone}
      phoneHref={settings.contactPhoneHref}
      enquiryNote={settings.quickEnquiryNote}
    />
  )
}
