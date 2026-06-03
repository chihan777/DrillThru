"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { aboutSettings, aboutValues, aboutTeam, projects, testimonials } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

// ─── File Upload ─────────────────────────────────────────────────────────────

export async function uploadImage(file: File) {
  try {
    const userId = await requireAuth()
    console.log('Auth successful, userId:', userId)

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    console.log('Uploads directory:', uploadsDir)
    
    await mkdir(uploadsDir, { recursive: true })
    console.log('Directory created/verified')

    const ext = path.extname(file.name) || ".jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const filePath = path.join(uploadsDir, filename)
    console.log('File will be saved to:', filePath)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('Buffer created, size:', buffer.length)
    
    await writeFile(filePath, buffer)
    console.log('File written successfully')

    const url = `/uploads/${filename}`
    console.log('Returning URL:', url)
    return { success: true, url }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("Upload error details:", errorMsg)
    return { success: false, error: `Upload failed: ${errorMsg}` }
  }
}

// ─── About Settings (text content: heading, subtitle, story) ────────────────

export async function getAboutSettings() {
  const rows = await db.select().from(aboutSettings)
  const map: Record<string, string> = {}
  for (const row of rows) {
    map[row.key] = row.value
  }
  return map
}

export async function saveAboutSettings(data: Record<string, string>) {
  await requireAuth()

  for (const [key, value] of Object.entries(data)) {
    await db
      .insert(aboutSettings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: aboutSettings.key,
        set: { value, updatedAt: new Date() },
      })
  }

  revalidatePath("/")
  revalidatePath("/admin/about")
  return { success: true }
}

// ─── Values ──────────────────────────────────────────────────────────────────

export async function getValues() {
  return db
    .select()
    .from(aboutValues)
    .orderBy(asc(aboutValues.order))
}

export async function createValue(formData: FormData) {
  await requireAuth()

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
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Create value error:", error)
    return { success: false, error: "Failed to create value." }
  }
}

export async function updateValue(id: number, formData: FormData) {
  await requireAuth()

  const icon = formData.get("icon") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string

  if (!icon || !title || !description) {
    return { success: false, error: "Please fill in all fields." }
  }

  try {
    await db.update(aboutValues).set({ icon, title, description }).where(eq(aboutValues.id, id))
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Update value error:", error)
    return { success: false, error: "Failed to update value." }
  }
}

export async function deleteValue(id: number) {
  await requireAuth()

  try {
    await db.delete(aboutValues).where(eq(aboutValues.id, id))
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
  return db
    .select()
    .from(aboutTeam)
    .orderBy(asc(aboutTeam.order))
}

export async function createTeamMember(formData: FormData) {
  await requireAuth()

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
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Create team member error:", error)
    return { success: false, error: "Failed to create team member." }
  }
}

export async function updateTeamMember(id: number, formData: FormData) {
  await requireAuth()

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
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Update team member error:", error)
    return { success: false, error: "Failed to update team member." }
  }
}

export async function deleteTeamMember(id: number) {
  await requireAuth()

  try {
    await db.delete(aboutTeam).where(eq(aboutTeam.id, id))
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
  return db
    .select()
    .from(projects)
    .orderBy(asc(projects.order))
}

export async function createProject(formData: FormData) {
  await requireAuth()

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
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Create project error:", error)
    return { success: false, error: "Failed to create project." }
  }
}

export async function updateProject(id: number, formData: FormData) {
  await requireAuth()

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
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Update project error:", error)
    return { success: false, error: "Failed to update project." }
  }
}

export async function deleteProject(id: number) {
  await requireAuth()

  try {
    await db.delete(projects).where(eq(projects.id, id))
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
  return db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.order))
}

export async function createTestimonial(formData: FormData) {
  await requireAuth()

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
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Create testimonial error:", error)
    return { success: false, error: "Failed to create testimonial." }
  }
}

export async function updateTestimonial(id: number, formData: FormData) {
  await requireAuth()

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
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Update testimonial error:", error)
    return { success: false, error: "Failed to update testimonial." }
  }
}

export async function deleteTestimonial(id: number) {
  await requireAuth()

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id))
    revalidatePath("/")
    revalidatePath("/admin/about")
    return { success: true }
  } catch (error) {
    console.error("Delete testimonial error:", error)
    return { success: false, error: "Failed to delete testimonial." }
  }
}
