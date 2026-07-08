"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (!session.data) {
        router.replace("/admin/sign-in")
      }
    })
  }, [router])

  return <>{children}</>
}
