"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { contactSubmissions } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function submitContact(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string | null
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return { success: false, error: "Please fill in all required fields." }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address." }
    }

    await db.insert(contactSubmissions).values({
      name,
      email,
      company: company || null,
      message,
    })

    return { success: true }
  } catch (error) {
    console.error("Contact submission error:", error)
    return { success: false, error: "Failed to submit. Please try again." }
  }
}

// ─── Admin: Enquiry Management ──────────────────────────────────────────────

export async function getEnquiries() {
  try {
    await requireAuth()
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt))
  } catch (error) {
    console.warn("Failed to fetch enquiries:", error)
    return []
  }
}

export async function toggleEnquiryRead(id: number, read: boolean) {
  try {
    await requireAuth()
    await db
      .update(contactSubmissions)
      .set({ read })
      .where(eq(contactSubmissions.id, id))
    revalidatePath("/admin/enquiries")
    return { success: true }
  } catch (error) {
    console.error("Toggle enquiry read error:", error)
    return { success: false, error: "Failed to update." }
  }
}

export async function deleteEnquiry(id: number) {
  try {
    await requireAuth()
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id))
    revalidatePath("/admin/enquiries")
    return { success: true }
  } catch (error) {
    console.error("Delete enquiry error:", error)
    return { success: false, error: "Failed to delete." }
  }
}
