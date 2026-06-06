"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { activityLog, loginHistory, session, user } from "@/lib/db/schema"
import { desc, eq, and, gt } from "drizzle-orm"

// ─── Auth helper ─────────────────────────────────────────────────────────────

async function requireAuth() {
  const s = await auth.api.getSession({ headers: await headers() })
  if (!s?.user) throw new Error("Unauthorized")
  return { userId: s.user.id, userName: s.user.name || "Unknown", userEmail: s.user.email || "unknown" }
}

// ─── Activity Logging (used internally by other actions) ─────────────────────

export async function logActivity(params: {
  userId: string
  userName: string
  userEmail: string
  action: string
  target: string
  details?: string
}) {
  try {
    const h = await headers()
    const ipAddress =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "unknown"

    await db.insert(activityLog).values({
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: params.action,
      target: params.target,
      details: params.details || null,
      ipAddress,
    })
  } catch (error) {
    console.warn("Failed to log activity:", error)
  }
}

// ─── Get Activity Logs (admin only) ──────────────────────────────────────────

export async function getActivityLogs(limit = 100) {
  await requireAuth()
  try {
    return await db
      .select()
      .from(activityLog)
      .orderBy(desc(activityLog.createdAt))
      .limit(limit)
  } catch (error) {
    console.warn("Failed to fetch activity logs:", error)
    return []
  }
}

// ─── Login Tracking ──────────────────────────────────────────────────────────

export async function recordLogin(userId: string, userName: string, userEmail: string) {
  try {
    const h = await headers()
    const ipAddress =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "unknown"
    const userAgent = h.get("user-agent") || "unknown"

    await db.insert(loginHistory).values({
      userId,
      userName,
      userEmail,
      ipAddress,
      userAgent,
    })
  } catch (error) {
    console.warn("Failed to record login:", error)
  }
}

// ─── Get Login History (admin only) ──────────────────────────────────────────

export async function getLoginHistory(limit = 100) {
  await requireAuth()
  try {
    return await db
      .select()
      .from(loginHistory)
      .orderBy(desc(loginHistory.loginTime))
      .limit(limit)
  } catch (error) {
    console.warn("Failed to fetch login history:", error)
    return []
  }
}

// ─── Get All Users (admin only) ──────────────────────────────────────────────

export async function getAllUsers() {
  await requireAuth()
  try {
    return await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
  } catch (error) {
    console.warn("Failed to fetch users:", error)
    return []
  }
}

// ─── Get Active Sessions (admin only) ────────────────────────────────────────

export async function getActiveSessions() {
  await requireAuth()
  try {
    const now = new Date()
    const rows = await db
      .select({
        sessionId: session.id,
        userId: session.userId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      })
      .from(session)
      .where(gt(session.expiresAt, now))
      .orderBy(desc(session.createdAt))

    return rows
  } catch (error) {
    console.warn("Failed to fetch active sessions:", error)
    return []
  }
}
