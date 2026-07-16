import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | DrillThru",
  description: "Read the terms and conditions governing the use of DrillThru's website and services.",
  alternates: {
    canonical: "https://www.drillthru.tech/terms",
  },
  openGraph: {
    title: "Terms of Service | DrillThru",
    description: "Read the terms and conditions governing the use of DrillThru's website and services.",
    url: "https://www.drillthru.tech/terms",
  },
}

export default function TermsPage() {
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
          <h1 className="mb-3 text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 10, 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-[15px] leading-relaxed text-foreground/80">

          <section>
            <p>
              Welcome to DrillThru. By accessing or using{" "}
              <a href="https://www.drillthru.tech" className="text-[#84cc16] hover:underline">
                www.drillthru.tech
              </a>{" "}
              (the &quot;Site&quot;) or engaging our services, you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). Please read them carefully. If you do not agree, do not use our Site or services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">1. About DrillThru</h2>
            <p>
              DrillThru is a digital agency based in Kathmandu, Nepal, providing web design, web development, SEO,
              digital marketing, Google Ads, Meta Ads, and brand identity services to businesses.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">2. Use of the Site</h2>
            <p className="mb-3">You agree to use this Site only for lawful purposes and in a way that does not:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>Infringe the rights of any third party</li>
              <li>Transmit any unsolicited or unauthorised advertising material (spam)</li>
              <li>Attempt to gain unauthorised access to any part of the Site or its systems</li>
              <li>Introduce viruses, malware, or any other harmful material</li>
              <li>Violate any applicable local, national, or international law or regulation</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">3. Services & Engagements</h2>
            <p className="mb-3">
              When you engage DrillThru for a project, the specific scope, deliverables, timeline, and pricing will
              be set out in a separate proposal, contract, or statement of work agreed between both parties. These
              Terms apply alongside any such agreement.
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Client responsibilities</strong> — You agree to provide accurate information, timely
                feedback, and any materials necessary for us to deliver the agreed services.
              </li>
              <li>
                <strong>Project changes</strong> — Any changes to agreed scope must be requested in writing.
                Additional work outside the original scope may incur additional charges.
              </li>
              <li>
                <strong>Timelines</strong> — Estimated timelines are dependent on timely client feedback and
                delivery of required assets. Delays on your end may affect delivery dates.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">4. Payment Terms</h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>Payment terms are specified in each project proposal or invoice.</li>
              <li>
                Unless otherwise agreed, projects require a deposit before work begins, with the balance due upon
                completion or at agreed milestones.
              </li>
              <li>
                Late payments may result in suspension of services until outstanding amounts are settled.
              </li>
              <li>All prices are in Nepali Rupees (NPR) unless otherwise stated.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">5. Intellectual Property</h2>
            <p className="mb-3">
              Upon receipt of full payment, DrillThru assigns to you all rights to the final deliverables created
              specifically for your project, unless otherwise agreed in writing.
            </p>
            <p className="mb-3">DrillThru retains:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>Ownership of all pre-existing tools, frameworks, code libraries, and methodologies used</li>
              <li>The right to display your project in our portfolio, unless you request otherwise in writing</li>
            </ul>
            <p className="mt-3">
              All content on this Site — including text, graphics, logos, and code — is the property of DrillThru
              and is protected by applicable intellectual property laws. You may not reproduce or distribute it
              without our written permission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">6. Third-Party Services</h2>
            <p>
              Some of our services involve third-party platforms such as Google Ads, Meta (Facebook/Instagram), and
              others. Use of these platforms is subject to their own terms and policies. DrillThru is not responsible
              for changes to third-party platform policies, pricing, or availability that affect campaign performance.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">7. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any proprietary or sensitive information shared during the
              course of a project and not to disclose it to third parties without prior written consent, except as
              required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">8. Disclaimer of Warranties</h2>
            <p className="mb-3">
              This Site and its content are provided &quot;as is&quot; without warranties of any kind, either
              express or implied, including but not limited to warranties of merchantability or fitness for a
              particular purpose.
            </p>
            <p>
              While we strive to deliver excellent results, DrillThru does not guarantee specific outcomes from SEO,
              advertising campaigns, or other marketing services, as results depend on many factors outside our
              control.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, DrillThru shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use of this Site or our services. Our
              total liability for any claim arising out of or related to our services shall not exceed the amount
              paid by you to DrillThru in the three months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">10. Termination</h2>
            <p>
              Either party may terminate a project engagement with written notice. In the event of termination, you
              agree to pay for all work completed up to the termination date. Specific termination terms may be
              outlined in individual project agreements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">11. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of Nepal. Any disputes arising
              from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the
              courts of Kathmandu, Nepal.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">12. Changes to These Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. The revised version will be posted on this
              page with an updated &quot;Last updated&quot; date. Continued use of the Site or our services after
              changes are posted constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">13. Contact Us</h2>
            <p>If you have any questions about these Terms, please reach out:</p>
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
          <Link href="/privacy" className="hover:text-[#84cc16]">Privacy Policy</Link>
          <Link href="/" className="hover:text-[#84cc16]">Back to Home</Link>
        </div>
      </main>
    </div>
  )
}
