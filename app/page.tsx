import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { WorkSection } from "@/components/work-section"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const revalidate = 86400 // 24 hours

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.drillthru.tech",
  },
  openGraph: {
    url: "https://www.drillthru.tech",
  },
}

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <WorkSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      {/* Noise Overlay */}
      <div className="noise-overlay" />
    </>
  )
}
