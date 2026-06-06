"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { aboutSettings, aboutValues, aboutTeam, projects, testimonials } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { logActivity } from "@/app/actions/audit"
// ─── File Upload ─────────────────────────────────────────────────────────────

export async function uploadImage(file: File) {
  try {
    const userId = await requireAuth()

    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: "File too large. Maximum size is 5MB." }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const mimeType = file.type || "image/jpeg"
    const dataUrl = `data:${mimeType};base64,${base64}`

    return { success: true, url: dataUrl }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("Upload error details:", errorMsg)
    return { success: false, error: `Upload failed: ${errorMsg}` }
  }
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return { userId: session.user.id, userName: session.user.name || "Unknown", userEmail: session.user.email || "unknown" }
}

// ─── About Settings (text content: heading, subtitle, story) ────────────────

export async function getAboutSettings() {
  try {
    const rows = await db.select().from(aboutSettings)
    const map: Record<string, string> = {}
    for (const row of rows) {
      map[row.key] = row.value
    }
    return map
  } catch (error) {
    console.error("getAboutSettings error:", error)
    return {}
  }
}

export async function saveAboutSettings(data: Record<string, string>) {
  const u = await requireAuth()

  for (const [key, value] of Object.entries(data)) {
    await db
      .insert(aboutSettings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: aboutSettings.key,
        set: { value, updatedAt: new Date() },
      })
  }

  await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Updated", target: "About Settings", details: `Updated ${Object.keys(data).length} about settings` })

  revalidatePath("/")
  revalidatePath("/admin/about")
  return { success: true }
}

// ─── Values ──────────────────────────────────────────────────────────────────

export async function getValues() {
  try {
    return await db
      .select()
      .from(aboutValues)
      .orderBy(asc(aboutValues.order))
  } catch (error) {
    console.error("getValues error:", error)
    return []
  }
}

export async function createValue(formData: FormData) {
  const u = await requireAuth()

  const icon = formData.get("icon") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string

  if (!icon || !title || !description) {
    return { success: false, error: "Please fill in all fields." }
  }

  const maxOrder = await db.select({ order: aboutValues.order }).from(aboutValues).orderBy(asc(aboutValues.order))
  const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map(r => r.order)) + 1 : 0

  try {
    await db.insert(aboutValues).values({ icon, title, description, order: nextOrder })
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Created", target: "About Value", details: `Created value: ${title}` })
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Create value error:", error)
    return { success: false, error: "Failed to create value." }
  }
}

export async function updateValue(id: number, formData: FormData) {
  const u = await requireAuth()

  const icon = formData.get("icon") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string

  if (!icon || !title || !description) {
    return { success: false, error: "Please fill in all fields." }
  }

  try {
    await db.update(aboutValues).set({ icon, title, description }).where(eq(aboutValues.id, id))
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Updated", target: "About Value", details: `Updated value: ${title}` })
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Update value error:", error)
    return { success: false, error: "Failed to update value." }
  }
}

export async function deleteValue(id: number) {
  const u = await requireAuth()

  try {
    await db.delete(aboutValues).where(eq(aboutValues.id, id))
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Deleted", target: "About Value", details: `Deleted value #${id}` })
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Delete value error:", error)
    return { success: false, error: "Failed to delete value." }
  }
}

// ─── Team Members ────────────────────────────────────────────────────────────

export async function getTeam() {
  try {
    return await db
      .select()
      .from(aboutTeam)
      .orderBy(asc(aboutTeam.order))
  } catch (error) {
    console.error("getTeam error:", error)
    return []
  }
}

export async function createTeamMember(formData: FormData) {
  const u = await requireAuth()

  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const initial = formData.get("initial") as string
  const description = formData.get("description") as string | null
  const email = formData.get("email") as string | null
  const linkedin = formData.get("linkedin") as string | null
  const github = formData.get("github") as string | null
  const image = formData.get("image") as string | null

  if (!name || !role || !initial) {
    return { success: false, error: "Please fill in name, role, and initial." }
  }

  const maxOrder = await db.select({ order: aboutTeam.order }).from(aboutTeam).orderBy(asc(aboutTeam.order))
  const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map(r => r.order)) + 1 : 0

  try {
    await db.insert(aboutTeam).values({
      name,
      role,
      initial: initial.toUpperCase().slice(0, 2),
      description: description || null,
      email: email || null,
      linkedin: linkedin || null,
      github: github || null,
      image: image || null,
      order: nextOrder,
    })
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Created", target: "Team Member", details: `Added team member: ${name}` })
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Create team member error:", error)
    return { success: false, error: "Failed to create team member." }
  }
}

export async function updateTeamMember(id: number, formData: FormData) {
  const u = await requireAuth()

  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const initial = formData.get("initial") as string
  const description = formData.get("description") as string | null
  const email = formData.get("email") as string | null
  const linkedin = formData.get("linkedin") as string | null
  const github = formData.get("github") as string | null
  const image = formData.get("image") as string | null

  if (!name || !role || !initial) {
    return { success: false, error: "Please fill in name, role, and initial." }
  }

  try {
    await db.update(aboutTeam).set({
      name,
      role,
      initial: initial.toUpperCase().slice(0, 2),
      description: description || null,
      email: email || null,
      linkedin: linkedin || null,
      github: github || null,
      image: image || null,
    }).where(eq(aboutTeam.id, id))
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Updated", target: "Team Member", details: `Updated team member: ${name}` })
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Update team member error:", error)
    return { success: false, error: "Failed to update team member." }
  }
}

export async function deleteTeamMember(id: number) {
  const u = await requireAuth()

  try {
    await db.delete(aboutTeam).where(eq(aboutTeam.id, id))
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Deleted", target: "Team Member", details: `Deleted team member #${id}` })
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Delete team member error:", error)
    return { success: false, error: "Failed to delete team member." }
  }
}

// ─── Projects ────────────────────────────────────────────────────────────────

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
  const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map(r => r.order)) + 1 : 0

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
    revalidatePath("/")
    revalidatePath("/admin/about")
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
    revalidatePath("/")
    revalidatePath("/admin/about")
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
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Delete project error:", error)
    return { success: false, error: "Failed to delete project." }
  }
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export async function getTestimonials() {
  try {
    return await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.order))
  } catch (error) {
    console.error("getTestimonials error:", error)
    return []
  }
}

export async function createTestimonial(formData: FormData) {
  const u = await requireAuth()

  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const company = formData.get("company") as string | null
  const content = formData.get("content") as string
  const rating = parseInt(formData.get("rating") as string) || 5
  const image = formData.get("image") as string | null

  if (!name || !role || !content) {
    return { success: false, error: "Please fill in name, role, and content." }
  }

  const maxOrder = await db.select({ order: testimonials.order }).from(testimonials).orderBy(asc(testimonials.order))
  const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map(r => r.order)) + 1 : 0

  try {
    await db.insert(testimonials).values({
      name,
      role,
      company: company || null,
      content,
      rating: Math.min(5, Math.max(1, rating)),
      image: image || null,
      order: nextOrder,
    })
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Created", target: "Testimonial", details: `Created testimonial from: ${name}` })
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Create testimonial error:", error)
    return { success: false, error: "Failed to create testimonial." }
  }
}

export async function updateTestimonial(id: number, formData: FormData) {
  const u = await requireAuth()

  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const company = formData.get("company") as string | null
  const content = formData.get("content") as string
  const rating = parseInt(formData.get("rating") as string) || 5
  const image = formData.get("image") as string | null

  if (!name || !role || !content) {
    return { success: false, error: "Please fill in name, role, and content." }
  }

  try {
    await db.update(testimonials).set({
      name,
      role,
      company: company || null,
      content,
      rating: Math.min(5, Math.max(1, rating)),
      image: image || null,
    }).where(eq(testimonials.id, id))
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Updated", target: "Testimonial", details: `Updated testimonial from: ${name}` })
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Update testimonial error:", error)
    return { success: false, error: "Failed to update testimonial." }
  }
}

export async function deleteTestimonial(id: number) {
  const u = await requireAuth()

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id))
    await logActivity({ userId: u.userId, userName: u.userName, userEmail: u.userEmail, action: "Deleted", target: "Testimonial", details: `Deleted testimonial #${id}` })
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Delete testimonial error:", error)
    return { success: false, error: "Failed to delete testimonial." }
  }
}
