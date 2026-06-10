"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { servicePages, serviceFaqs, serviceTestimonials, serviceProjects } from "@/lib/db/schema"
import { eq, asc, desc } from "drizzle-orm"
import { logActivity } from "@/app/actions/audit"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return { userId: session.user.id, userName: session.user.name || "Unknown", userEmail: session.user.email || "unknown" }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// ─── Read ──────────────────────────────────────────────────────────────────────

export async function getServices() {
  const u = await getUserId()
  try {
    return await db
      .select()
      .from(servicePages)
      .where(eq(servicePages.userId, u.userId))
      .orderBy(asc(servicePages.order))
  } catch (error) {
    console.error("getServices error:", error)
    return []
  }
}

export async function getService(id: number) {
  const u = await getUserId()
  const rows = await db
    .select()
    .from(servicePages)
    .where(eq(servicePages.id, id))
    .limit(1)
  if (!rows[0]) return null

  const [faqs, testimonials, projects] = await Promise.all([
    db
      .select()
      .from(serviceFaqs)
      .where(eq(serviceFaqs.serviceId, id))
      .orderBy(asc(serviceFaqs.order)),
    db
      .select()
      .from(serviceTestimonials)
      .where(eq(serviceTestimonials.serviceId, id))
      .orderBy(asc(serviceTestimonials.order)),
    db
      .select()
      .from(serviceProjects)
      .where(eq(serviceProjects.serviceId, id))
      .orderBy(asc(serviceProjects.order)),
  ])

  return { ...rows[0], faqs, testimonials, projects }
}

// ─── Create ────────────────────────────────────────────────────────────────────

export async function createService(formData: FormData) {
  const u = await getUserId()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const icon = (formData.get("icon") as string) || "Globe"
  const featuredImage = (formData.get("featuredImage") as string) || null
  const seoTitle = (formData.get("seoTitle") as string) || title
  const seoDescription = (formData.get("seoDescription") as string) || description
  const seoKeywords = (formData.get("seoKeywords") as string) || null
  const canonicalUrl = (formData.get("canonicalUrl") as string) || null
  const ogImage = (formData.get("ogImage") as string) || null
  const twitterCard = (formData.get("twitterCard") as string) || "summary_large_image"
  const robotsMeta = (formData.get("robotsMeta") as string) || "index,follow"
  const ctaHeading = (formData.get("ctaHeading") as string) || null
  const ctaDescription = (formData.get("ctaDescription") as string) || null
  const ctaButtonText = (formData.get("ctaButtonText") as string) || "Get Started"
  const ctaButtonLink = (formData.get("ctaButtonLink") as string) || "#contact"
  const projectLink = (formData.get("projectLink") as string) || null
  const published = formData.get("published") === "true"
  const order = parseInt((formData.get("order") as string) || "0", 10)
  const faqsJson = (formData.get("faqs") as string) || "[]"
  const testimonialsJson = (formData.get("testimonials") as string) || "[]"
  const projectsJson = (formData.get("projects") as string) || "[]"

  if (!title || !description || !content) {
    return { success: false, error: "Please fill in all required fields." }
  }

  const slug = generateSlug(title)
  const existingSlugs = await db
    .select({ slug: servicePages.slug })
    .from(servicePages)
    .where(eq(servicePages.slug, slug))
  const finalSlug = existingSlugs.length > 0 ? `${slug}-${Date.now()}` : slug

  try {
    const result = await db
      .insert(servicePages)
      .values({
        userId: u.userId,
        title,
        slug: finalSlug,
        description,
        content,
        icon,
        featuredImage,
        projectLink,
        seoTitle,
        seoDescription,
        seoKeywords,
        canonicalUrl,
        ogImage,
        twitterCard,
        robotsMeta,
        ctaHeading,
        ctaDescription,
        ctaButtonText,
        ctaButtonLink,
        published,
        order,
      })
      .returning({ id: servicePages.id })

    const serviceId = result[0].id

    // Insert FAQs
    const faqs = JSON.parse(faqsJson) as { question: string; answer: string }[]
    for (let i = 0; i < faqs.length; i++) {
      if (faqs[i].question && faqs[i].answer) {
        await db.insert(serviceFaqs).values({
          serviceId,
          question: faqs[i].question,
          answer: faqs[i].answer,
          order: i,
        })
      }
    }

    // Insert testimonials
    const tms = JSON.parse(testimonialsJson) as {
      name: string
      role: string
      company?: string
      content: string
      rating: number
    }[]
    for (let i = 0; i < tms.length; i++) {
      if (tms[i].name && tms[i].content) {
        await db.insert(serviceTestimonials).values({
          serviceId,
          name: tms[i].name,
          role: tms[i].role || "",
          company: tms[i].company || null,
          content: tms[i].content,
          rating: tms[i].rating || 5,
          order: i,
        })
      }
    }

    // Insert projects
    const projs = JSON.parse(projectsJson) as { title: string; description?: string; image?: string; link?: string }[]
    for (let i = 0; i < projs.length; i++) {
      if (projs[i].title) {
        await db.insert(serviceProjects).values({
          serviceId,
          title: projs[i].title,
          description: projs[i].description || null,
          image: projs[i].image || null,
          link: projs[i].link || null,
          order: i,
        })
      }
    }

    revalidatePath("/admin/services")
    revalidatePath("/services")
    revalidatePath("/sitemap.xml")

    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Created", target: "Service Page", details: `Created service: ${title}` })

    return { success: true, id: serviceId }
  } catch (error) {
    console.error("Create service error:", error)
    return { success: false, error: "Failed to create service." }
  }
}

// ─── Update ────────────────────────────────────────────────────────────────────

export async function updateService(id: number, formData: FormData) {
  const u = await getUserId()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const icon = (formData.get("icon") as string) || "Globe"
  const featuredImage = (formData.get("featuredImage") as string) || null
  const seoTitle = (formData.get("seoTitle") as string) || title
  const seoDescription = (formData.get("seoDescription") as string) || description
  const seoKeywords = (formData.get("seoKeywords") as string) || null
  const canonicalUrl = (formData.get("canonicalUrl") as string) || null
  const ogImage = (formData.get("ogImage") as string) || null
  const twitterCard = (formData.get("twitterCard") as string) || "summary_large_image"
  const robotsMeta = (formData.get("robotsMeta") as string) || "index,follow"
  const ctaHeading = (formData.get("ctaHeading") as string) || null
  const ctaDescription = (formData.get("ctaDescription") as string) || null
  const ctaButtonText = (formData.get("ctaButtonText") as string) || "Get Started"
  const ctaButtonLink = (formData.get("ctaButtonLink") as string) || "#contact"
  const projectLink = (formData.get("projectLink") as string) || null
  const published = formData.get("published") === "true"
  const order = parseInt((formData.get("order") as string) || "0", 10)
  const faqsJson = (formData.get("faqs") as string) || "[]"
  const testimonialsJson = (formData.get("testimonials") as string) || "[]"
  const projectsJson = (formData.get("projects") as string) || "[]"

  if (!title || !description || !content) {
    return { success: false, error: "Please fill in all required fields." }
  }

  try {
    await db
      .update(servicePages)
      .set({
        title,
        description,
        content,
        icon,
        featuredImage,
        projectLink,
        seoTitle,
        seoDescription,
        seoKeywords,
        canonicalUrl,
        ogImage,
        twitterCard,
        robotsMeta,
        ctaHeading,
        ctaDescription,
        ctaButtonText,
        ctaButtonLink,
        published,
        order,
        updatedAt: new Date(),
      })
      .where(eq(servicePages.id, id))

    // Replace FAQs (delete + re-insert)
    await db.delete(serviceFaqs).where(eq(serviceFaqs.serviceId, id))
    const faqs = JSON.parse(faqsJson) as { question: string; answer: string }[]
    for (let i = 0; i < faqs.length; i++) {
      if (faqs[i].question && faqs[i].answer) {
        await db.insert(serviceFaqs).values({
          serviceId: id,
          question: faqs[i].question,
          answer: faqs[i].answer,
          order: i,
        })
      }
    }

    // Replace testimonials (delete + re-insert)
    await db.delete(serviceTestimonials).where(eq(serviceTestimonials.serviceId, id))
    const tms = JSON.parse(testimonialsJson) as {
      name: string
      role: string
      company?: string
      content: string
      rating: number
    }[]
    for (let i = 0; i < tms.length; i++) {
      if (tms[i].name && tms[i].content) {
        await db.insert(serviceTestimonials).values({
          serviceId: id,
          name: tms[i].name,
          role: tms[i].role || "",
          company: tms[i].company || null,
          content: tms[i].content,
          rating: tms[i].rating || 5,
          order: i,
        })
      }
    }

    // Replace projects (delete + re-insert)
    await db.delete(serviceProjects).where(eq(serviceProjects.serviceId, id))
    const projs = JSON.parse(projectsJson) as { title: string; description?: string; image?: string; link?: string }[]
    for (let i = 0; i < projs.length; i++) {
      if (projs[i].title) {
        await db.insert(serviceProjects).values({
          serviceId: id,
          title: projs[i].title,
          description: projs[i].description || null,
          image: projs[i].image || null,
          link: projs[i].link || null,
          order: i,
        })
      }
    }

    revalidatePath("/admin/services")
    revalidatePath("/services")
    if (rows[0]) {
      revalidatePath(`/services/${rows[0].slug}`)
    }
    revalidatePath("/sitemap.xml")

    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Updated", target: "Service Page", details: `Updated service: ${title}` })

    return { success: true }
  } catch (error) {
    console.error("Update service error:", error)
    return { success: false, error: "Failed to update service." }
  }
}

// ─── Delete ────────────────────────────────────────────────────────────────────

export async function deleteService(id: number) {
  const u = await getUserId()

  try {
    // Cascade deletes FAQs + testimonials via FK
    await db
      .delete(servicePages)
      .where(eq(servicePages.id, id))

    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Deleted", target: "Service Page", details: `Deleted service #${id}` })

    revalidatePath("/admin/services")
    revalidatePath("/services")

    return { success: true }
  } catch (error) {
    console.error("Delete service error:", error)
    return { success: false, error: "Failed to delete service." }
  }
}

// ─── Toggle Publish ────────────────────────────────────────────────────────────

export async function toggleServicePublished(id: number, published: boolean) {
  const u = await getUserId()

  try {
    await db
      .update(servicePages)
      .set({ published, updatedAt: new Date() })
      .where(eq(servicePages.id, id))

    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: published ? "Published" : "Unpublished", target: "Service Page", details: `${published ? "Published" : "Unpublished"} service #${id}` })

    revalidatePath("/admin/services")
    revalidatePath("/services")

    return { success: true }
  } catch (error) {
    console.error("Toggle service published error:", error)
    return { success: false, error: "Failed to update service." }
  }
}
