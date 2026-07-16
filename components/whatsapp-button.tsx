"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { WhatsAppIcon } from "./whatsapp-icon"

interface WhatsAppButtonProps {
  href: string
}

/** Floating WhatsApp chat button, bottom-left so it clears the "Enquire Now" FAB. */
export function WhatsAppButton({ href }: WhatsAppButtonProps) {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/40 active:scale-95"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" />
      <WhatsAppIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-[#0a0a0a] px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </motion.a>
  )
}
