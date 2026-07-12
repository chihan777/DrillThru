"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { eq, asc, sql } from "drizzle-orm"
import { logActivity } from "@/app/actions/audit"

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return { userId: session.user.id, userName: session.user.name || "Unknown", userEmail: session.user.email || "unknown" }
}

export async function getProjects() {
  try {
    return await db
      .select()
      .from(projects)
      .orderBy(asc(projects.order))
  } catch (error) {
    console.error("getProjects error:", error)
    return []
  }
}

export async function createProject(formData: FormData) {
  const u = await requireAuth()

  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string | null
  const link = formData.get("link") as string | null
  const color = formData.get("color") as string

  if (!title || !category || !description) {
    return { success: false, error: "Please fill in title, category, and description." }
  }

  const maxOrder = await db.select({ order: projects.order }).from(projects).orderBy(asc(projects.order))
  const nextOrder =
    maxOrder.length > 0 ? Math.max(...maxOrder.map((r: { order: number }) => r.order)) + 1 : 0

  try {
    await db.insert(projects).values({
      title,
      category,
      description,
      image: image || null,
      link: link || null,
      color: color || "from-blue-500/20 to-purple-500/20",
      order: nextOrder,
    })
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Created", target: "Project", details: `Created project: ${title}` })
    revalidatePath("/admin/projects")
    revalidatePath("/", "page")
    return { success: true }
  } catch (error) {
    console.error("Create project error:", error)
    return { success: false, error: "Failed to create project." }
  }
}

export async function updateProject(id: number, formData: FormData) {
  const u = await requireAuth()

  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string | null
  const link = formData.get("link") as string | null
  const color = formData.get("color") as string

  if (!title || !category || !description) {
    return { success: false, error: "Please fill in title, category, and description." }
  }

  try {
    await db.update(projects).set({
      title,
      category,
      description,
      image: image || null,
      link: link || null,
      color: color || "from-blue-500/20 to-purple-500/20",
    }).where(eq(projects.id, id))
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Updated", target: "Project", details: `Updated project: ${title}` })
    revalidatePath("/admin/projects")
    revalidatePath("/", "page")
    return { success: true }
  } catch (error) {
    console.error("Update project error:", error)
    return { success: false, error: "Failed to update project." }
  }
}

export async function deleteProject(id: number) {
  const u = await requireAuth()

  try {
    await db.delete(projects).where(eq(projects.id, id))
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Deleted", target: "Project", details: `Deleted project #${id}` })
    revalidatePath("/admin/projects")
    revalidatePath("/", "page")
    return { success: true }
  } catch (error) {
    console.error("Delete project error:", error)
    return { success: false, error: "Failed to delete project." }
  }
}

export async function reorderProject(id: number, direction: "up" | "down") {
  const u = await requireAuth()

  try {
    const all = await db
      .select({ id: projects.id, order: projects.order })
      .from(projects)
      .orderBy(asc(projects.order))

    const idx = all.findIndex((p) => p.id === id)
    if (idx === -1) return { success: false, error: "Project not found." }
    if (direction === "up" && idx === 0) return { success: true }
    if (direction === "down" && idx === all.length - 1) return { success: true }

    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    const current = all[idx]
    const target = all[swapIdx]

    await db.transaction(async (tx) => {
      await tx
        .update(projects)
        .set({ order: target.order })
        .where(eq(projects.id, current.id))
      await tx
        .update(projects)
        .set({ order: current.order })
        .where(eq(projects.id, target.id))
    })

    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Reordered", target: "Project", details: `Moved project #${id} ${direction}` })
    revalidatePath("/admin/projects")
    revalidatePath("/", "page")
    return { success: true }
  } catch (error) {
    console.error("Reorder project error:", error)
    return { success: false, error: "Failed to reorder project." }
  }
}
