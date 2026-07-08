"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const router = useRouter()

  function handleSignOut() {
    authClient.signOut()
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
