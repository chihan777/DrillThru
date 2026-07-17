import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function getUserFromSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    // Anonymous visitors see a 404 — the admin area is invisible.
    // Sign in at /louda/sign-in.
    notFound()
  }
  return session.user
}
