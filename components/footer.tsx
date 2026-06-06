import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { getSiteSettings } from "@/app/actions/settings"

const footerLinks = {
  services: [
    { label: "Web Design & Development", href: "#services" },
    { label: "SEO Services Nepal", href: "#services" },
    { label: "Digital Marketing", href: "#services" },
    { label: "Google Ads Management", href: "#services" },
    { label: "Meta Ads (Facebook & Instagram)", href: "#services" },
    { label: "Brand Identity Design", href: "#services" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Our Work", href: "#work" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "#contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

export async function Footer() {
  const settings = await getSiteSettings()

  const socialLinks = [
    { icon: Facebook, href: settings.facebookUrl, label: "Facebook" },
    { icon: Twitter, href: settings.twitterUrl, label: "Twitter" },
    { icon: Linkedin, href: settings.linkedinUrl, label: "LinkedIn" },
    { icon: Instagram, href: settings.instagramUrl, label: "Instagram" },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[#84cc16]">
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  D
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">DrillThru</span>
            </Link>
            <p className="mb-6 text-sm text-muted-foreground">
              {settings.footerDescription}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-secondary p-2 text-muted-foreground transition-colors hover:bg-[#84cc16] hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-[#84cc16]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-[#84cc16]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="transition-colors hover:text-[#84cc16]">
                  {settings.contactEmail}
                </a>
              </li>
              <li>
                <a href={`tel:${settings.contactPhoneHref}`} className="transition-colors hover:text-[#84cc16]">
                  {settings.contactPhone}
                </a>
              </li>
              <li>
                {settings.contactLocationLine1}<br />
                {settings.contactLocationLine2}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DrillThru. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-[#84cc16]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
