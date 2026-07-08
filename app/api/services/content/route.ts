import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { serviceContent } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const rows = await db.select().from(serviceContent).where(eq(serviceContent.page, "services")).limit(1)
    if (!rows[0]) {
      return NextResponse.json({ id: null, page: "services", title: "Services", content: "", updatedAt: null })
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("GET /api/services/content error:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content } = body

    if (typeof title !== "string" || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const existing = await db.select().from(serviceContent).where(eq(serviceContent.page, "services")).limit(1)

    if (existing[0]) {
      await db
        .update(serviceContent)
        .set({ title, content, updatedAt: new Date() })
        .where(eq(serviceContent.id, existing[0].id))
    } else {
      await db.insert(serviceContent).values({ page: "services", title, content })
    }

    return NextResponse.json({ success: true, updatedAt: new Date().toISOString() })
  } catch (error) {
    console.error("PUT /api/services/content error:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
