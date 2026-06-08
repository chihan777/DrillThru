import { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { blogPosts, servicePages } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://drillthru.tech"

async function getPublishedSlugs() {
  try {
    return await db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt))
  } catch {
    return []
  }
}

async function getPublishedServiceSlugs() {
  try {
    return await db
      .select({ slug: servicePages.slug, updatedAt: servicePages.updatedAt })
      .from(servicePages)
      .where(eq(servicePages.published, true))
      .orderBy(desc(servicePages.createdAt))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([
    getPublishedSlugs(),
    getPublishedServiceSlugs(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const servicePageEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...servicePageEntries, ...blogPages]
}
