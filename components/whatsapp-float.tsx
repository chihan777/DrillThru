import { getSiteSettings } from "@/app/actions/settings"
import { WhatsAppButton } from "./whatsapp-button"

export async function WhatsAppFloat() {
  const settings = await getSiteSettings()
  const base = settings.whatsappUrl?.trim()
  if (!base) return null

  const message = "Hi DrillThru, I'd like to enquire about your services."
  const href = base.includes("?")
    ? base
    : `${base}?text=${encodeURIComponent(message)}`

  return <WhatsAppButton href={href} />
}
