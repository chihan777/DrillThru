"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function getPosts() {
  const userId = await getUserId()
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.userId, userId))
    .orderBy(desc(blogPosts.createdAt))
}

export async function getPost(id: number) {
  const userId = await getUserId()
  const posts = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.id, id), eq(blogPosts.userId, userId)))
    .limit(1)
  return posts[0] || null
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function createPost(formData: FormData) {
  const userId = await getUserId()

  const title = formData.get("title") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const metaTitle = formData.get("metaTitle") as string
  const metaDescription = formData.get("metaDescription") as string
  const published = formData.get("published") === "true"

  if (!title || !excerpt || !content) {
    return { success: false, error: "Please fill in all required fields." }
  }

  const slug = generateSlug(title)

  // Check if slug exists
  const existingSlugs = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
  
  const finalSlug = existingSlugs.length > 0 
    ? `${slug}-${Date.now()}` 
    : slug

  try {
    const result = await db.insert(blogPosts).values({
      userId,
      title,
      slug: finalSlug,
      excerpt,
      content,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      published,
    }).returning({ id: blogPosts.id })

    revalidatePath("/admin")
    revalidatePath("/blog")
    
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Create post error:", error)
    return { success: false, error: "Failed to create post." }
  }
}

export async function updatePost(id: number, formData: FormData) {
  const userId = await getUserId()

  const title = formData.get("title") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const metaTitle = formData.get("metaTitle") as string
  const metaDescription = formData.get("metaDescription") as string
  const published = formData.get("published") === "true"

  if (!title || !excerpt || !content) {
    return { success: false, error: "Please fill in all required fields." }
  }

  try {
    await db
      .update(blogPosts)
      .set({
        title,
        excerpt,
        content,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        published,
        updatedAt: new Date(),
      })
      .where(and(eq(blogPosts.id, id), eq(blogPosts.userId, userId)))

    revalidatePath("/admin")
    revalidatePath("/blog")
    revalidatePath(`/blog/${(await getPost(id))?.slug}`)
    
    return { success: true }
  } catch (error) {
    console.error("Update post error:", error)
    return { success: false, error: "Failed to update post." }
  }
}

export async function deletePost(id: number) {
  const userId = await getUserId()

  try {
    await db
      .delete(blogPosts)
      .where(and(eq(blogPosts.id, id), eq(blogPosts.userId, userId)))

    revalidatePath("/admin")
    revalidatePath("/blog")
    
    return { success: true }
  } catch (error) {
    console.error("Delete post error:", error)
    return { success: false, error: "Failed to delete post." }
  }
}

export async function togglePublished(id: number, published: boolean) {
  const userId = await getUserId()

  try {
    await db
      .update(blogPosts)
      .set({ published, updatedAt: new Date() })
      .where(and(eq(blogPosts.id, id), eq(blogPosts.userId, userId)))

    revalidatePath("/admin")
    revalidatePath("/blog")
    
    return { success: true }
  } catch (error) {
    console.error("Toggle published error:", error)
    return { success: false, error: "Failed to update post." }
  }
}
