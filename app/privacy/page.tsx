import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | DrillThru",
  description: "Learn how DrillThru collects, uses, and protects your personal information.",
  alternates: {
    canonical: "https://www.drillthru.tech/privacy",
  },
  openGraph: {
    title: "Privacy Policy | DrillThru",
    description: "Learn how DrillThru collects, uses, and protects your personal information.",
    url: "https://www.drillthru.tech/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.jpeg" alt="DrillThru" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-lg font-bold tracking-tight">DrillThru</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <span className="mb-3 inline-block text-sm font-medium uppercase tracking-wider text-[#84cc16]">
            Legal
          </span>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 10, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-[15px] leading-relaxed text-foreground/80">

          <section>
            <p>
              DrillThru (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates{" "}
              <a href="https://www.drillthru.tech" className="text-[#84cc16] hover:underline">
                www.drillthru.tech
              </a>{" "}
              (the &quot;Site&quot;). This Privacy Policy explains what information we collect, how we use it, and your
              rights in relation to it. By using our Site or services, you agree to the practices described here.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mb-3">We collect information in the following ways:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Information you provide directly</strong> — When you fill out our contact form, request a
                quote, or email us, we collect your name, email address, phone number, and the message you send.
              </li>
              <li>
                <strong>Usage data</strong> — We automatically collect data about how you interact with our Site,
                including pages visited, time spent, referring URLs, browser type, device type, and IP address.
              </li>
              <li>
                <strong>Cookies and tracking technologies</strong> — We use cookies and similar tools to understand
                visitor behaviour and improve our Site. See Section 6 for details.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>Respond to your enquiries and provide the services you request</li>
              <li>Send project updates, invoices, and service-related communications</li>
              <li>Improve our website, services, and marketing materials</li>
              <li>Analyse site traffic and usage through Google Analytics</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">3. Legal Basis for Processing</h2>
            <p>
              We process your personal data based on your consent (when you submit a form), the performance of a
              contract (when we provide services to you), and our legitimate interests in operating and improving our
              business.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">4. Data Sharing</h2>
            <p className="mb-3">
              We may share your information with trusted third-party service providers who assist us in operating our
              Site and delivering our services, including:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Google Analytics</strong> — for website traffic analysis (
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#84cc16] hover:underline"
                >
                  Google Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong>Vercel</strong> — for website hosting and infrastructure
              </li>
              <li>
                <strong>Email service providers</strong> — for sending transactional emails
              </li>
            </ul>
            <p className="mt-3">
              All third parties are obligated to keep your information confidential and use it only for the purpose
              of providing services to us.
            </p>
            <p className="mt-3">
              We may also disclose your information if required by law or to protect the rights and safety of
              DrillThru, our clients, or others.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services, comply with legal
              obligations, resolve disputes, and enforce our agreements. Enquiry data is typically retained for up to
              3 years unless you request deletion earlier.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">6. Cookies</h2>
            <p className="mb-3">We use the following types of cookies on our Site:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Essential cookies</strong> — required for the Site to function correctly
              </li>
              <li>
                <strong>Analytics cookies</strong> — used by Google Analytics to help us understand how visitors
                use our Site
              </li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings. Disabling certain cookies may affect the
              functionality of the Site.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw consent at any time where processing is based on consent</li>
              <li>Object to processing of your data for direct marketing</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:hello@drillthru.tech" className="text-[#84cc16] hover:underline">
                hello@drillthru.tech
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">8. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal information
              against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">9. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites. We are not responsible for the privacy practices
              or content of those sites. We encourage you to review the privacy policies of any third-party sites
              you visit.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">10. Children&apos;s Privacy</h2>
            <p>
              Our Site and services are not directed at children under the age of 13. We do not knowingly collect
              personal information from children. If you believe we have inadvertently collected such data, please
              contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be posted on this page
              with a revised &quot;Last updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <div className="mt-4 rounded-xl border border-border bg-card p-5 text-sm">
              <p className="font-semibold text-foreground">DrillThru</p>
              <p className="mt-1 text-muted-foreground">Thamel, Kathmandu, Nepal</p>
              <p className="mt-1">
                <a href="mailto:hello@drillthru.tech" className="text-[#84cc16] hover:underline">
                  hello@drillthru.tech
                </a>
              </p>
              <p className="mt-1">
                <a href="https://www.drillthru.tech" className="text-[#84cc16] hover:underline">
                  www.drillthru.tech
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Bottom nav */}
        <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-border pt-8 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-[#84cc16]">Terms of Service</Link>
          <Link href="/" className="hover:text-[#84cc16]">Back to Home</Link>
        </div>
      </main>
    </div>
  )
}
