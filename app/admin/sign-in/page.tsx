import { notFound } from "next/navigation"

// The admin login moved to a non-obvious path (/louda/sign-in).
// This old URL 404s so it doesn't leak the new location.
export default function OldAdminSignInPage() {
  notFound()
}
