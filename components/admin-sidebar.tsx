"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  Activity,
  ShieldCheck,
  Plus,
  FolderOpen,
  Menu,
  X,
} from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"

interface Props {
  user: { name: string | null; email: string | null }
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/about", label: "About Section", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/activity", label: "Activity Log", icon: Activity },
  { href: "/admin/users", label: "Users & Sessions", icon: ShieldCheck },
  { href: "/admin/posts/new", label: "New Post", icon: Plus },
]

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the drawer whenever the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [open])

  return (
    <>
      {/* Mobile top bar */}
      <div className="admin-sidebar fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/icon.jpeg" alt="DrillThru" className="h-9 w-9 rounded-lg object-cover" />
          <span className="font-bold tracking-tight text-white">DrillThru</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Backdrop (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={`admin-sidebar fixed left-0 top-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/icon.jpeg" alt="DrillThru" className="h-9 w-9 rounded-lg object-cover" />
              <span className="font-bold tracking-tight text-white">DrillThru</span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    active
                      ? "flex items-center gap-3 rounded-lg bg-[#84cc16]/15 px-3 py-2.5 text-sm font-medium text-[#a3e635]"
                      : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#84cc16]/20 text-sm font-bold text-[#a3e635]">
                {user.name?.charAt(0) || user.email?.charAt(0) || "A"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{user.name || "Admin"}</p>
                <p className="truncate text-xs text-white/40">{user.email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>
    </>
  )
}
