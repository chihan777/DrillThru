"use server"

import { db } from "@/lib/db"
import { contactSubmissions } from "@/lib/db/schema"

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
