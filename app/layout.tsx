import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { QuickContact } from '@/components/quick-contact'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    default: 'DrillThru | Web Design, Web Development & Digital Marketing Agency in Nepal',
    template: '%s | DrillThru',
  },
  description: 'DrillThru is Nepal\'s leading web design and development agency. We offer professional website design, web development, SEO services, digital marketing, Google Ads, and Meta ads management for businesses in Kathmandu and across Nepal.',
  keywords: [
    // Core keywords
    'web design Nepal', 'web development Nepal', 'website design and development Nepal',
    'website design Kathmandu', 'web development agency Nepal', 'web design agency Kathmandu',
    // SEO keywords
    'SEO agency Nepal', 'SEO services Nepal', 'search engine optimization Nepal',
    'local SEO Kathmandu', 'SEO company Nepal', 'Google ranking Nepal',
    // Digital marketing
    'digital marketing Nepal', 'digital marketing agency Nepal', 'online marketing Nepal',
    'social media marketing Nepal', 'content marketing Nepal',
    // Paid advertising
    'Google Ads Nepal', 'Google Ads management Nepal', 'PPC agency Nepal',
    'Meta Ads Nepal', 'Facebook Ads Nepal', 'Instagram Ads Nepal', 'paid advertising Nepal',
    // Technical
    'e-commerce website Nepal', 'WordPress development Nepal', 'React development Nepal',
    'Next.js development Nepal', 'custom website Nepal', 'responsive web design Nepal',
    // Brand + misc
    'DrillThru', 'marketing agency Nepal', 'brand identity Nepal', 'creative agency Nepal',
  ],
  authors: [{ name: 'DrillThru', url: 'https://drillthru.tech' }],
  creator: 'DrillThru',
  publisher: 'DrillThru',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://drillthru.tech'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DrillThru',
    title: 'DrillThru | Web Design, Web Development & Digital Marketing Agency in Nepal',
    description: 'Nepal\'s premier web design and development agency. Professional website design, SEO services, Google Ads, Meta Ads, and digital marketing solutions that drive real results for Nepali businesses.',
    url: 'https://drillthru.tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DrillThru | Web Design, Web Development & Digital Marketing Agency in Nepal',
    description: 'Nepal\'s premier web design and development agency. Professional website design, SEO services, Google Ads, Meta Ads, and digital marketing solutions.',
  },
  alternates: {
    canonical: 'https://drillthru.tech',
  },
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'NP-BA',
    'geo.placename': 'Kathmandu',
    'geo.position': '27.7172;85.3240',
    'ICBM': '27.7172, 85.3240',
  },
  icons: {
    icon: '/icon.jpeg',
    apple: '/icon.jpeg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a14',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" data-scroll-behavior="smooth">
      <head>
        <meta name="google-site-verification" content="XuRfUWO7u8XE2PyvZjuBpAj0tuVMIKk-XXpibPVltQE" />
        <Script
          id="gtag-script"
          async
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-FSPQW4F9Z5"
        />
        <Script
          id="gtag-inline"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FSPQW4F9Z5');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* Organization + LocalBusiness + Services JSON-LD */}
        <Script
          id="jsonld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MarketingAgency",
              "@id": "https://drillthru.tech/#organization",
              name: "DrillThru",
              alternateName: "DrillThru Digital Agency",
              url: "https://drillthru.tech",
              description: "DrillThru is Nepal's leading web design, web development, and digital marketing agency. We offer professional website design and development, SEO services, Google Ads management, Meta Ads campaigns, and full-service digital marketing for businesses in Kathmandu and across Nepal.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Thamel",
                addressLocality: "Kathmandu",
                addressRegion: "Bagmati Province",
                addressCountry: "NP",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 27.7172,
                longitude: 85.3240,
              },
              telephone: "+977-1-234-5678",
              email: "hello@drillthru.tech",
              areaServed: {
                "@type": "Country",
                name: "Nepal",
              },
              sameAs: [
                "https://facebook.com/drillthru",
                "https://twitter.com/drillthru",
                "https://linkedin.com/company/drillthru",
                "https://instagram.com/drillthru",
              ],
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Web Design and Development",
                    description: "Professional website design and development services in Nepal. Custom responsive websites, e-commerce solutions, and web applications built with Next.js and React.",
                    serviceType: "Web Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "SEO Services",
                    description: "Data-driven SEO services and search engine optimization for businesses in Nepal. Technical SEO, local SEO, content strategy, and link building.",
                    serviceType: "Search Engine Optimization",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Digital Marketing",
                    description: "Full-service digital marketing agency in Nepal. Social media marketing, content marketing, email marketing, and strategic campaigns.",
                    serviceType: "Digital Marketing",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Google Ads Management",
                    description: "Professional Google Ads and PPC campaign management in Nepal. Search ads, display ads, and shopping ads optimized for maximum ROI.",
                    serviceType: "Pay-Per-Click Advertising",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Meta Ads Management",
                    description: "Expert Facebook Ads and Instagram Ads management for businesses in Nepal. Targeted Meta ad campaigns to reach your ideal customers.",
                    serviceType: "Social Media Advertising",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Brand Identity Design",
                    description: "Creative brand identity design services in Nepal. Logo design, visual identity, brand guidelines, and complete rebranding.",
                    serviceType: "Brand Identity",
                  },
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "50",
                bestRating: "5",
              },
              priceRange: "$$",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
            }),
          }}
        />

        {/* WebSite JSON-LD with SearchAction */}
        <Script
          id="jsonld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://drillthru.tech/#website",
              name: "DrillThru",
              url: "https://drillthru.tech",
              publisher: { "@id": "https://drillthru.tech/#organization" },
              inLanguage: "en",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://drillthru.tech/blog?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* FAQPage JSON-LD */}
        <Script
          id="jsonld-faqpage"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How much does web design and development cost in Nepal?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Website design and development costs in Nepal vary based on complexity. At DrillThru, we offer custom quotes based on your specific requirements — from simple landing pages to complex e-commerce platforms and web applications. Contact us for a free consultation.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long does it take to build a website in Nepal?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A typical website project takes 2-6 weeks depending on complexity. Simple landing pages can be delivered in 1-2 weeks, while full e-commerce sites or custom web applications may take 4-8 weeks.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you offer SEO services for businesses in Nepal?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, DrillThru provides comprehensive SEO services for businesses in Nepal. Our packages include technical SEO audits, keyword research for the Nepali market, on-page optimization, local SEO, content strategy, and link building.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can you manage Google Ads and Meta Ads for my business?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Absolutely. DrillThru manages Google Ads (search, display, shopping) and Meta Ads (Facebook and Instagram) campaigns for businesses across Nepal. We create targeted ad strategies optimized for maximum ROI.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What makes DrillThru different from other digital agencies in Nepal?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "DrillThru stands out with our deep understanding of the Nepali market, modern technology stack (Next.js, React), data-driven approach to SEO and marketing, and proven track record of delivering results for over 50 businesses across Nepal.",
                  },
                },
              ],
            }),
          }}
        />
        {children}
        <WhatsAppFloat />
        <QuickContact />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
