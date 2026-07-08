"use client"

import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  async function handleSignOut() {
    // Call sign-out API up to 3 times until session is cleared
    for (let i = 0; i < 3; i++) {
      if (i > 0) await new Promise(r => setTimeout(r, 200))
      await authClient.signOut()
      const { data: session } = await authClient.getSession()
      if (!session) break
    }
    window.location.href = "/"
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  )
}
