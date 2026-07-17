import { notFound } from "next/navigation"

// Public registration is disabled (see lib/auth.ts disableSignUp) and the
// login moved to a non-obvious path. This URL intentionally 404s.
export default function OldAdminSignUpPage() {
  notFound()
}
