import { Globe, Search, Megaphone, Palette, BarChart3, Zap, Target, MousePointerClick } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ServiceCardData = {
  icon: LucideIcon
  title: string
  slug: string
  description: string
  features: string[]
  pageContent: string
  faqs: {
    question: string
    answer: string
  }[]
  ctaHeading?: string
  ctaDescription?: string
  ctaButtonText?: string
  ctaButtonLink?: string
  testimonials?: {
    name: string
    role: string
    company?: string
    content: string
    rating: number
  }[]
  projects?: {
    title: string
    description?: string
    image?: string
    link?: string
  }[]
}

const GENERIC_SERVICE_TESTIMONIAL = {
  name: "Sita Shah",
  role: "Founder",
  company: "Kathmandu Textile",
  content: "DrillThru helped our business stand out online and convert more customers with a clear, professional service page.",
  rating: 5,
}

const GENERIC_SERVICE_PROJECT = {
  title: "Featured Client Success",
  description: "A tailored digital solution that improved engagement and conversions for a local business.",
  link: "/#contact",
}

export const serviceCards: ServiceCardData[] = [
  {
    icon: Globe,
    title: "Web Design & Development",
    slug: "web-design-development",
    description:
      "Custom websites built for Nepali businesses. From stunning e-commerce stores to powerful web apps — fast, mobile-first designs that convert visitors into customers.",
    features: ["Responsive Design", "E-commerce Stores", "Custom Web Apps", "WordPress & CMS"],
    pageContent: `
      <article>
        <p>Web design and development in Nepal should feel modern, fast, and intuitive. At DrillThru, we build websites that balance aesthetic appeal with conversion-focused layouts, optimized performance, and responsive design for every screen.</p>
        <p>Our website solutions include custom e-commerce, booking systems, membership portals, and content-managed sites that help Nepali businesses grow online. We blend strong branding, clean UI, and search-friendly architecture to ensure your site stands out and performs.</p>
        <h2>What we offer</h2>
        <ul>
          <li>Responsive, mobile-first website design</li>
          <li>E-commerce stores with seamless checkout</li>
          <li>Custom web apps and integrations</li>
          <li>Content management systems and WordPress solutions</li>
        </ul>
        <p>Whether you need a new website or a redesign, our web development team builds digital experiences that look great and work reliably under Nepal’s real-world traffic and connection conditions.</p>
      </article>
    `,
    faqs: [
      {
        question: "Can you build a website in Nepali and English?",
        answer: "Yes. We create bilingual and multilingual websites using modern frameworks, ensuring content is accessible to Nepal’s local market and international audiences.",
      },
      {
        question: "Do you offer custom website development or only templates?",
        answer: "We offer both custom-built websites and tailored templates, depending on your needs. Every project is optimized for performance, security, and scalability.",
      },
    ],
    ctaHeading: "Ready to build a website that sells for your business?",
    ctaDescription: "Book a free consultation and let DrillThru design a website that looks beautiful, performs fast, and converts visitors into customers.",
    ctaButtonText: "Book a Free Call",
    ctaButtonLink: "#contact",
    testimonials: [GENERIC_SERVICE_TESTIMONIAL],
    projects: [GENERIC_SERVICE_PROJECT],
  },
  {
    icon: Search,
    title: "SEO Services",
    slug: "seo-services",
    description:
      "Rank higher on Google and drive organic traffic. Data-driven SEO strategies proven to increase visibility, leads, and revenue for businesses across Nepal.",
    features: ["Technical SEO Audits", "Local SEO Nepal", "Content Strategy", "Link Building"],
    pageContent: `
      <article>
        <p>Search Engine Optimization (SEO) is one of the most effective digital marketing strategies for increasing your online visibility, attracting qualified traffic, and generating more leads. At DrillThru, we help businesses across Nepal improve their Google rankings through data-driven SEO strategies that deliver long-term growth.</p>
        <p>Our SEO services combine technical optimization, on-page content refinement, local SEO focus, and organic link-building to make your business more discoverable for customers searching in Kathmandu and beyond.</p>
        <p>Every engagement begins with a deep website audit to identify issues that impact search performance, from crawlability and page speed to content structure and mobile usability. We then build a customized SEO plan that aligns with your business goals, target audience, and competitive landscape.</p>
        <h2>How we deliver SEO results</h2>
        <p>We deliver measurable SEO improvements through a four-step process: audit, optimization, content, and monitoring. Our team performs technical SEO fixes, refines page content for customer intent, and optimizes local listings so your business is easier to find across Google Search and Maps.</p>
        <h3>Technical SEO and site health</h3>
        <p>Technical SEO is the foundation of every successful campaign. We address site speed, structured data, sitemap quality, index coverage, and mobile responsiveness so search engines can crawl and rank your website effectively.</p>
        <h3>Content that converts</h3>
        <p>Strong SEO content is both search-friendly and user-focused. We optimize title tags, headings, meta descriptions, and page copy to match what your customers are searching for, while keeping your brand voice clear and persuasive.</p>
        <h3>Local SEO for Nepalese businesses</h3>
        <p>Local search is crucial for Nepali businesses targeting customers in Kathmandu, Pokhara, Bhaktapur, and beyond. We optimize Google Business Profile listings, location pages, and local citations so your business ranks higher for nearby searches.</p>
        <h2>What we offer</h2>
        <ul>
          <li>Technical SEO audits and issue fixes</li>
          <li>Keyword research for Nepal-specific search intent</li>
          <li>On-page optimization and content improvements</li>
          <li>Local SEO and Google Business optimization</li>
        </ul>
        <p>We tailor every SEO campaign to your industry and target market, delivering measurable progress in search visibility, organic traffic, and lead generation.</p>
        <p>As your SEO partner, we also track performance through monthly reporting and analytics so you can see the impact of our work on rankings, traffic, leads, and sales. Our focus is on sustainable growth rather than temporary ranking spikes.</p>
        <p>Whether you are launching a new website, reviving an existing site, or expanding into new local markets, DrillThru builds SEO strategies designed to deliver long-term, measurable success.</p>
      </article>
    `,
    faqs: [
      {
        question: "How long does it take to see results from SEO?",
        answer: "SEO results typically begin to appear in 3-6 months, depending on competition and website readiness. We focus on sustainable growth and continuous improvement.",
      },
      {
        question: "Do you provide SEO for local Nepal businesses?",
        answer: "Absolutely. We specialize in local SEO for Kathmandu, Pokhara, Bhaktapur, and other Nepal markets to help customers find your business nearby.",
      },
    ],
    ctaHeading: "Need more organic traffic from Google?",
    ctaDescription: "Talk to our SEO team to improve rankings, attract local customers, and grow your online visibility across Nepal.",
    ctaButtonText: "Start SEO Strategy",
    ctaButtonLink: "#contact",
    testimonials: [GENERIC_SERVICE_TESTIMONIAL],
    projects: [GENERIC_SERVICE_PROJECT],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Full-service digital marketing that grows your brand. Social media management, content marketing, and email campaigns that engage and convert your audience.",
    features: ["Social Media Marketing", "Content Marketing", "Email Campaigns", "Influencer Marketing"],
    pageContent: `
      <article>
        <p>Digital marketing is essential for building brand awareness and converting leads online. DrillThru provides integrated marketing campaigns that combine social media, content, and email channels to reach your ideal audience in Nepal.</p>
        <p>We create campaigns that are tailored to your business goals, using engaging creative, smart targeting, and measurable tracking to ensure every rupee is invested effectively.</p>
        <h2>What we offer</h2>
        <ul>
          <li>Social media strategy and account management</li>
          <li>Content marketing for blogs, social, and email</li>
          <li>Email campaigns and lead nurturing workflows</li>
          <li>Marketing analytics and campaign optimization</li>
        </ul>
        <p>From awareness to conversion, our digital marketing services help Nepali brands connect with customers and grow their online presence.</p>
      </article>
    `,
    faqs: [
      {
        question: "Which digital channels do you manage?",
        answer: "We manage Facebook, Instagram, email marketing, and content channels to create cohesive digital campaigns.",
      },
      {
        question: "Can you help with campaign performance reporting?",
        answer: "Yes. We provide regular reporting and optimization recommendations to maximize your marketing ROI.",
      },
    ],
    ctaHeading: "Ready to launch a high-performing digital campaign?",
    ctaDescription: "Create a marketing plan that drives engagement, leads, and growth across social, email, and content channels.",
    ctaButtonText: "Talk to a Strategist",
    ctaButtonLink: "#contact",
    testimonials: [GENERIC_SERVICE_TESTIMONIAL],
    projects: [GENERIC_SERVICE_PROJECT],
  },
  {
    icon: MousePointerClick,
    title: "Google Ads Management",
    slug: "google-ads-management",
    description:
      "Get immediate, high-ROI results with expert Google Ads. Search, display, and shopping campaigns that generate qualified leads and sales.",
    features: ["Search Ads", "Display Network", "Shopping Ads", "Conversion Tracking"],
    pageContent: `
      <article>
        <p>Google Ads gives your business fast visibility in search results and across the web. DrillThru manages high-performing search ads, display campaigns, and shopping ads to attract the right customers quickly.</p>
        <p>We optimize every campaign for conversions, using targeted keywords, persuasive ad copy, and landing pages designed to convert clicks into customers.</p>
        <h2>What we offer</h2>
        <ul>
          <li>Search campaign setup and optimization</li>
          <li>Display ads and remarketing campaigns</li>
          <li>Shopping ads for e-commerce businesses</li>
          <li>Conversion tracking and ROI reporting</li>
        </ul>
        <p>Our Google Ads management is built for Nepal’s market, helping businesses reach customers at the moment they’re ready to buy.</p>
      </article>
    `,
    faqs: [
      {
        question: "Do you manage both search and display campaigns?",
        answer: "Yes. We manage search, display, shopping, and remarketing campaigns to maximize reach and conversions.",
      },
      {
        question: "Will I get regular reports on ad performance?",
        answer: "Yes. We provide detailed performance reports and recommendations for campaign improvement.",
      },
    ],
    ctaHeading: "Want ads that deliver real leads and sales?",
    ctaDescription: "Let our Google Ads experts build campaigns that drive conversions and improve ROI for your business.",
    ctaButtonText: "Launch Ad Campaign",
    ctaButtonLink: "#contact",
    testimonials: [GENERIC_SERVICE_TESTIMONIAL],
    projects: [GENERIC_SERVICE_PROJECT],
  },
  {
    icon: Target,
    title: "Meta Ads (Facebook & Instagram)",
    slug: "meta-ads-facebook-instagram",
    description:
      "Reach millions with targeted Facebook and Instagram ads. Scroll-stopping campaigns that build awareness, drive engagement, and generate sales.",
    features: ["Facebook Ads", "Instagram Ads", "Retargeting", "Lead Generation"],
    pageContent: `
      <article>
        <p>Meta Ads offer exceptional reach and targeting for Nepal’s social audiences. DrillThru creates Facebook and Instagram campaigns that build brand awareness, engage users, and drive leads.</p>
        <p>We focus on compelling creatives, audience targeting, and continuous optimization to deliver measurable results at every stage of the funnel.</p>
        <h2>What we offer</h2>
        <ul>
          <li>Facebook and Instagram campaign management</li>
          <li>Audience targeting and retargeting</li>
          <li>Creative ad design and copywriting</li>
          <li>Lead generation and click-to-site campaigns</li>
        </ul>
        <p>Whether you want more customers, more followers, or more leads, we design Meta ad campaigns that support your business goals.</p>
      </article>
    `,
    faqs: [
      {
        question: "Do you target Nepal-specific audiences?",
        answer: "Yes. We build audiences based on location, interests, and behavior to reach customers across Nepal.",
      },
      {
        question: "Can you run both brand and direct response campaigns?",
        answer: "Absolutely. We run campaigns for both brand building and lead generation depending on your objectives.",
      },
    ],
    ctaHeading: "Ready to reach customers on Facebook and Instagram?",
    ctaDescription: "Reach your target audience with high-impact Meta ads built for engagement, traffic, and conversions.",
    ctaButtonText: "Book Meta Strategy",
    ctaButtonLink: "#contact",
    testimonials: [GENERIC_SERVICE_TESTIMONIAL],
    projects: [GENERIC_SERVICE_PROJECT],
  },
  {
    icon: Palette,
    title: "Brand Identity Design",
    slug: "brand-identity-design",
    description:
      "Stand out with a memorable brand identity. Professional logos, visual systems, and brand guidelines that build lasting customer trust.",
    features: ["Logo Design", "Visual Identity", "Brand Guidelines", "Rebranding"],
    pageContent: `
      <article>
        <p>A strong brand identity helps customers recognize and trust your business instantly. DrillThru develops logos, color systems, typography, and visual guidelines that reflect your brand’s personality and goals.</p>
        <p>Our brand identity process combines strategic discovery with creative design so your brand communicates clearly across digital and print channels.</p>
        <h2>What we offer</h2>
        <ul>
          <li>Logo and identity system design</li>
          <li>Brand messaging and voice development</li>
          <li>Visual style guides and brand assets</li>
          <li>Rebranding for evolving businesses</li>
        </ul>
        <p>From startups to established companies, our brand identity work helps businesses look professional and memorable across every customer touchpoint.</p>
      </article>
    `,
    faqs: [
      {
        question: "Can you refresh an existing brand identity?",
        answer: "Yes. We offer rebranding services to modernize and strengthen your current brand identity.",
      },
      {
        question: "Do you provide brand guidelines?",
        answer: "Absolutely. We deliver brand guidelines so your visual system stays consistent across all materials.",
      },
    ],
    ctaHeading: "Need a brand identity that feels unforgettable?",
    ctaDescription: "Build a visual system that makes your business look polished, cohesive, and memorable across every channel.",
    ctaButtonText: "Start Brand Design",
    ctaButtonLink: "#contact",
    testimonials: [GENERIC_SERVICE_TESTIMONIAL],
    projects: [GENERIC_SERVICE_PROJECT],
  },
  {
    icon: BarChart3,
    title: "Growth Strategy",
    slug: "growth-strategy",
    description:
      "Data-driven strategies to accelerate your growth. Market research, competitor analysis, and digital roadmaps for sustainable business expansion.",
    features: ["Market Research", "Competitor Analysis", "Growth Hacking", "KPI Tracking"],
    pageContent: `
      <article>
        <p>Growth strategy is the foundation for scaling your business online. DrillThru creates digital growth roadmaps that combine market research, competitive analysis, and customer-focused tactics.</p>
        <p>We help businesses identify the most effective channels, products, and campaigns to drive sustainable revenue growth across Nepal and beyond.</p>
        <h2>What we offer</h2>
        <ul>
          <li>Market research and competitor analysis</li>
          <li>Growth planning and channel strategy</li>
          <li>Campaign and funnel optimization</li>
          <li>KPI tracking and performance reporting</li>
        </ul>
        <p>Our growth strategy services give you a clear plan for expanding your digital footprint and converting more visitors into customers.</p>
      </article>
    `,
    faqs: [
      {
        question: "What does a growth strategy include?",
        answer: "A growth strategy includes market research, target audience analysis, channel planning, and measurable KPIs.",
      },
      {
        question: "Can you help improve existing marketing efforts?",
        answer: "Yes. We optimize current campaigns and recommend new opportunities to accelerate growth.",
      },
    ],
    ctaHeading: "Ready for a growth strategy that scales?",
    ctaDescription: "Get a data-driven roadmap for faster customer acquisition, stronger retention, and healthier business growth.",
    ctaButtonText: "Build a Growth Plan",
    ctaButtonLink: "#contact",
    testimonials: [GENERIC_SERVICE_TESTIMONIAL],
    projects: [GENERIC_SERVICE_PROJECT],
  },
  {
    icon: Zap,
    title: "Website Performance",
    slug: "website-performance",
    description:
      "Make your website lightning-fast. Page speed, Core Web Vitals, and UX optimization that reduce bounce rates and increase conversions.",
    features: ["Speed Optimization", "Core Web Vitals", "UX Design", "A/B Testing"],
    pageContent: `
      <article>
        <p>Website performance is critical for user experience and search rankings. DrillThru improves load speeds, Core Web Vitals, and usability so your site feels fast and reliable.</p>
        <p>We tune front-end performance, optimize images and scripts, and refine the user journey to reduce friction and increase conversions.</p>
        <h2>What we offer</h2>
        <ul>
          <li>Page speed and Core Web Vitals optimization</li>
          <li>Performance audits and technical improvements</li>
          <li>UX and interaction optimization</li>
          <li>A/B testing for better conversion rates</li>
        </ul>
        <p>Faster pages keep visitors engaged, improve search visibility, and help your website deliver better results for your business.</p>
      </article>
    `,
    faqs: [
      {
        question: "Why is website performance important?",
        answer: "Fast pages reduce bounce rates, improve user satisfaction, and can boost search rankings.",
      },
      {
        question: "Do you optimize mobile performance too?",
        answer: "Yes. We tune websites for mobile speed and responsiveness as well as desktop performance.",
      },
    ],
    ctaHeading: "Want a website that feels lightning-fast?",
    ctaDescription: "Improve speed, reliability, and user experience with performance optimizations tailored for your site.",
    ctaButtonText: "Optimize Now",
    ctaButtonLink: "#contact",
    testimonials: [GENERIC_SERVICE_TESTIMONIAL],
    projects: [GENERIC_SERVICE_PROJECT],
  },
]

export function findStaticServiceBySlug(slug: string) {
  return serviceCards.find((service) => service.slug === slug) || null
}

export function getStaticServiceFallbackContent(service: ServiceCardData) {
  return service.pageContent
}
