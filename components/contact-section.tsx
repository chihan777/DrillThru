import { Mail, Phone, MapPin } from "lucide-react"
import { getSiteSettings } from "@/app/actions/settings"
import { ContactFormClient } from "./contact-form-client"
import { SectionEyebrow } from "./section-eyebrow"

export async function ContactSection() {
  const settings = await getSiteSettings()

  return (
    <section id="contact" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-[#84cc16]/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16">
          <SectionEyebrow>Get in Touch</SectionEyebrow>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to{" "}
            <span className="gradient-text">drill through</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            Let&apos;s discuss how we can help transform your digital presence.
            Drop us a message and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form (client component) */}
          <ContactFormClient />

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-6 text-2xl font-bold">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl border border-[#84cc16]/20 bg-[#84cc16]/10 p-3">
                    <Mail className="h-5 w-5 text-[#84cc16]" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-muted-foreground transition-colors hover:text-[#84cc16]"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl border border-[#84cc16]/20 bg-[#84cc16]/10 p-3">
                    <Phone className="h-5 w-5 text-[#84cc16]" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <a
                      href={`tel:${settings.contactPhoneHref}`}
                      className="text-muted-foreground transition-colors hover:text-[#84cc16]"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl border border-[#84cc16]/20 bg-[#84cc16]/10 p-3">
                    <MapPin className="h-5 w-5 text-[#84cc16]" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-muted-foreground">
                      {settings.contactLocationLine1}<br />
                      {settings.contactLocationLine2}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]">
              <h4 className="mb-4 font-semibold">Business Hours</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>{settings.businessHoursWeekday}</span>
                  <span>{settings.businessHoursWeekdayTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>{settings.businessHoursWeekend}</span>
                  <span>{settings.businessHoursWeekendTime}</span>
                </div>
              </div>
            </div>

            {/* Quick Response */}
            <div className="rounded-xl border border-[#84cc16]/30 bg-[#84cc16]/5 p-6">
              <h4 className="mb-2 font-semibold text-[#84cc16]">{settings.quickResponseTitle}</h4>
              <p className="text-sm text-muted-foreground">
                {settings.quickResponseText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
