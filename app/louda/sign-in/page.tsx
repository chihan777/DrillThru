import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Sign In | DrillThru",
  description: "Sign in to the DrillThru admin panel",
  robots: { index: false, follow: false },
}

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect("/admin")
  }

  return <AuthForm mode="sign-in" />
}
