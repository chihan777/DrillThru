"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Phone, Send, CheckCircle2 } from "lucide-react"
import { submitContact } from "@/app/actions/contact"

interface QuickContactClientProps {
  phone: string
  phoneHref: string
  enquiryNote: string
}

export function QuickContactClient({ phone, phoneHref, enquiryNote }: QuickContactClientProps) {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitContact(formData)
      if (result.success) {
        setIsSubmitted(true)
      } else {
        setError(result.error || "Something went wrong.")
      }
    } catch {
      setError("Failed to submit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    setIsOpen(false)
    // Reset form after animation
    setTimeout(() => {
      setIsSubmitted(false)
      setError(null)
    }, 300)
  }

  return (
    <>
      {/* Floating Enquire Now Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-[#84cc16] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#84cc16]/30 transition-all hover:scale-105 hover:bg-[#65a30d] hover:shadow-xl hover:shadow-[#84cc16]/40 active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">Enquire Now</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick Contact Form Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            {/* Form Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-0 left-0 z-50 w-full max-w-md sm:bottom-6 sm:left-6 sm:rounded-2xl"
            >
              <div className="overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl">
                {/* Header with hotline */}
                <div className="relative bg-gradient-to-r from-[#84cc16] to-[#65a30d] px-6 py-5">
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                        Quick Enquiry
                      </p>
                      <a
                        href={`tel:${phoneHref}`}
                        className="text-lg font-bold text-white transition-colors hover:text-white/90"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-white/70">
                    {enquiryNote}
                  </p>
                </div>

                {/* Form Body */}
                <div className="max-h-[60vh] overflow-y-auto p-6">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-8 text-center"
                    >
                      <CheckCircle2 className="mb-3 h-14 w-14 text-[#84cc16]" />
                      <h3 className="mb-1 text-xl font-bold">Message Sent!</h3>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll get back to you within 24 hours.
                      </p>
                      <button
                        onClick={handleClose}
                        className="mt-4 rounded-lg bg-[#84cc16]/10 px-4 py-2 text-sm font-medium text-[#84cc16] transition-colors hover:bg-[#84cc16]/20"
                      >
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    <form action={handleSubmit} className="space-y-4">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Name *
                        </label>
                        <input
                          name="name"
                          required
                          placeholder="Your name"
                          className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16]/30"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Email *
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16]/30"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Phone (optional)
                        </label>
                        <input
                          name="company"
                          placeholder="Your phone or company"
                          className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16]/30"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          How can we help? *
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={3}
                          placeholder="I need help with..."
                          className="w-full resize-none rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16]/30"
                        />
                      </div>

                      {error && (
                        <p className="text-xs text-destructive">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#84cc16] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#65a30d] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Enquiry
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
