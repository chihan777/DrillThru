"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { servicePages, serviceFaqs, serviceTestimonials } from "@/lib/db/schema"
import { eq, and, asc, desc } from "drizzle-orm"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// ─── Read ──────────────────────────────────────────────────────────────────────

export async function getServices() {
  const userId = await getUserId()
  return db
    .select()
    .from(servicePages)
    .where(eq(servicePages.userId, userId))
    .orderBy(asc(servicePages.order))
}

export async function getService(id: number) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(servicePages)
    .where(and(eq(servicePages.id, id), eq(servicePages.userId, userId)))
    .limit(1)
  if (!rows[0]) return null

  const [faqs, testimonials] = await Promise.all([
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
  ])

  return { ...rows[0], faqs, testimonials }
}

// ─── Create ────────────────────────────────────────────────────────────────────

export async function createService(formData: FormData) {
  const userId = await getUserId()

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
  const published = formData.get("published") === "true"
  const order = parseInt((formData.get("order") as string) || "0", 10)
  const faqsJson = (formData.get("faqs") as string) || "[]"
  const testimonialsJson = (formData.get("testimonials") as string) || "[]"

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
        userId,
        title,
        slug: finalSlug,
        description,
        content,
        icon,
        featuredImage,
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

    revalidatePath("/admin/services")
    revalidatePath("/services")

    return { success: true, id: serviceId }
  } catch (error) {
    console.error("Create service error:", error)
    return { success: false, error: "Failed to create service." }
  }
}

// ─── Update ────────────────────────────────────────────────────────────────────

export async function updateService(id: number, formData: FormData) {
  const userId = await getUserId()

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
  const published = formData.get("published") === "true"
  const order = parseInt((formData.get("order") as string) || "0", 10)
  const faqsJson = (formData.get("faqs") as string) || "[]"
  const testimonialsJson = (formData.get("testimonials") as string) || "[]"

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
      .where(and(eq(servicePages.id, id), eq(servicePages.userId, userId)))

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

    revalidatePath("/admin/services")
    revalidatePath("/services")

    // Get slug for revalidation
    const rows = await db
      .select({ slug: servicePages.slug })
      .from(servicePages)
      .where(eq(servicePages.id, id))
      .limit(1)
    if (rows[0]) {
      revalidatePath(`/services/${rows[0].slug}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Update service error:", error)
    return { success: false, error: "Failed to update service." }
  }
}

// ─── Delete ────────────────────────────────────────────────────────────────────

export async function deleteService(id: number) {
  const userId = await getUserId()

  try {
    // Cascade deletes FAQs + testimonials via FK
    await db
      .delete(servicePages)
      .where(and(eq(servicePages.id, id), eq(servicePages.userId, userId)))

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
  const userId = await getUserId()

  try {
    await db
      .update(servicePages)
      .set({ published, updatedAt: new Date() })
      .where(and(eq(servicePages.id, id), eq(servicePages.userId, userId)))

    revalidatePath("/admin/services")
    revalidatePath("/services")

    return { success: true }
  } catch (error) {
    console.error("Toggle service published error:", error)
    return { success: false, error: "Failed to update service." }
  }
}
