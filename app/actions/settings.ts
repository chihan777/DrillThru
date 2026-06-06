"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { DEFAULT_SITE_SETTINGS } from "@/lib/default-settings"

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

// ─── Public: Get all site settings ──────────────────────────────────────────
export async function getSiteSettings() {
  try {
    const rows = await db.select().from(siteSettings)
    const map: Record<string, string> = { ...DEFAULT_SITE_SETTINGS }
    for (const row of rows) {
      map[row.key] = row.value
    }
    return map
  } catch (error) {
    console.warn("getSiteSettings error, returning defaults:", error)
    return { ...DEFAULT_SITE_SETTINGS }
  }
}

// ─── Admin: Save site settings ──────────────────────────────────────────────
export async function saveSiteSettings(data: Record<string, string>) {
  await requireAuth()

  for (const [key, value] of Object.entries(data)) {
    await db
      .insert(siteSettings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      })
  }

  revalidatePath("/")
  revalidatePath("/admin/settings")
  return { success: true }
}
