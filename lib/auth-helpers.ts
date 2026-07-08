import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function getUserFromSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect("/admin/sign-in")
  }
  return session.user
}
