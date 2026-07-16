import type { ReactNode } from "react"

/**
 * Consistent "eyebrow" label used above every section heading.
 * A small pill with a pulsing dot + uppercase brand-green label.
 */
export function SectionEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`mb-4 inline-flex items-center gap-2 rounded-full border border-[#84cc16]/25 bg-[#84cc16]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a3e635] sm:text-xs ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#84cc16] opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#84cc16]" />
      </span>
      {children}
    </span>
  )
}
