'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mail, Phone, MapPin, Clock, MessageCircle, Facebook, Twitter, Linkedin, Instagram,
  Save, Loader2, ChevronDown, ChevronUp, Type, FileText,
} from 'lucide-react'
import { saveSiteSettings } from '@/app/actions/settings'
import { DEFAULT_SITE_SETTINGS } from '@/lib/default-settings'

interface Props {
  settings: Record<string, string>
}

/* ── Collapsible Section ─────────────────────────────────────────────────── */
function Section({ icon: Icon, title, subtitle, children, defaultOpen = false }: {
  icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="admin-card overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/40">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#84cc16]/10">
            <Icon className="h-4.5 w-4.5 text-[#65a30d]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1a2e0a]">{title}</h3>
            <p className="text-xs text-[#6b7f5e]">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {open ? <ChevronUp className="h-4 w-4 text-[#6b7f5e]" /> : <ChevronDown className="h-4 w-4 text-[#6b7f5e]" />}
        </div>
      </button>
      {open && <div className="border-t border-[#e2edcf] p-5">{children}</div>}
    </div>
  )
}

export function AdminSettingsForm({ settings: initialSettings }: Props) {
  const router = useRouter()
  const [settings, setSettings] = useState({ ...DEFAULT_SITE_SETTINGS, ...initialSettings })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const result = await saveSiteSettings(settings)
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
        router.refresh()
      } else {
        setError('Failed to save settings.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Contact Information ── */}
      <Section icon={Phone} title="Contact Information" subtitle="Email, phone, and location shown on the contact section & footer" defaultOpen>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label mb-1 block text-[11px]">Email Address</label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[#6b7f5e]" />
              <input className="admin-input" value={settings.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} placeholder="hello@drillthru.tech" />
            </div>
          </div>
          <div>
            <label className="admin-label mb-1 block text-[11px]">Phone Display</label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[#6b7f5e]" />
              <input className="admin-input" value={settings.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} placeholder="+977 1-234-5678" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="admin-label mb-1 block text-[11px]">Phone href (tel: link, no spaces)</label>
          <input className="admin-input" value={settings.contactPhoneHref} onChange={(e) => update('contactPhoneHref', e.target.value)} placeholder="+9771234567890" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label mb-1 block text-[11px]">Location Line 1</label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-[#6b7f5e]" />
              <input className="admin-input" value={settings.contactLocationLine1} onChange={(e) => update('contactLocationLine1', e.target.value)} placeholder="Thamel, Kathmandu" />
            </div>
          </div>
          <div>
            <label className="admin-label mb-1 block text-[11px]">Location Line 2</label>
            <input className="admin-input" value={settings.contactLocationLine2} onChange={(e) => update('contactLocationLine2', e.target.value)} placeholder="Nepal" />
          </div>
        </div>
      </Section>

      {/* ── Business Hours ── */}
      <Section icon={Clock} title="Business Hours" subtitle="Working hours displayed in the contact section">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label mb-1 block text-[11px]">Weekday Label</label>
            <input className="admin-input" value={settings.businessHoursWeekday} onChange={(e) => update('businessHoursWeekday', e.target.value)} placeholder="Sunday - Friday" />
          </div>
          <div>
            <label className="admin-label mb-1 block text-[11px]">Weekday Time</label>
            <input className="admin-input" value={settings.businessHoursWeekdayTime} onChange={(e) => update('businessHoursWeekdayTime', e.target.value)} placeholder="9:00 AM - 6:00 PM" />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label mb-1 block text-[11px]">Weekend Label</label>
            <input className="admin-input" value={settings.businessHoursWeekend} onChange={(e) => update('businessHoursWeekend', e.target.value)} placeholder="Saturday" />
          </div>
          <div>
            <label className="admin-label mb-1 block text-[11px]">Weekend Time</label>
            <input className="admin-input" value={settings.businessHoursWeekendTime} onChange={(e) => update('businessHoursWeekendTime', e.target.value)} placeholder="Closed" />
          </div>
        </div>
      </Section>

      {/* ── Quick Enquiry ── */}
      <Section icon={MessageCircle} title="Quick Enquiry Popup" subtitle="Settings for the floating enquiry button and popup panel">
        <div>
          <label className="admin-label mb-1 block text-[11px]">Enquiry Note (shown below phone number)</label>
          <textarea className="admin-textarea !min-h-[3.5rem]" value={settings.quickEnquiryNote} onChange={(e) => update('quickEnquiryNote', e.target.value)} placeholder="Call us directly or fill the form below..." rows={2} />
        </div>
        <div className="mt-4">
          <label className="admin-label mb-1 block text-[11px]">Quick Response Title</label>
          <input className="admin-input" value={settings.quickResponseTitle} onChange={(e) => update('quickResponseTitle', e.target.value)} placeholder="Quick Response Guaranteed" />
        </div>
        <div className="mt-4">
          <label className="admin-label mb-1 block text-[11px]">Quick Response Text</label>
          <textarea className="admin-textarea !min-h-[3.5rem]" value={settings.quickResponseText} onChange={(e) => update('quickResponseText', e.target.value)} placeholder="We respond to all inquiries within 24 hours..." rows={2} />
        </div>
      </Section>

      {/* ── Social Media Links ── */}
      <Section icon={Facebook} title="Social Media Links" subtitle="Social media URLs shown in the footer">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label mb-1 flex items-center gap-1.5 text-[11px]"><Facebook className="h-3 w-3" /> Facebook URL</label>
            <input className="admin-input" value={settings.facebookUrl} onChange={(e) => update('facebookUrl', e.target.value)} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className="admin-label mb-1 flex items-center gap-1.5 text-[11px]"><Twitter className="h-3 w-3" /> Twitter URL</label>
            <input className="admin-input" value={settings.twitterUrl} onChange={(e) => update('twitterUrl', e.target.value)} placeholder="https://twitter.com/..." />
          </div>
          <div>
            <label className="admin-label mb-1 flex items-center gap-1.5 text-[11px]"><Linkedin className="h-3 w-3" /> LinkedIn URL</label>
            <input className="admin-input" value={settings.linkedinUrl} onChange={(e) => update('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/company/..." />
          </div>
          <div>
            <label className="admin-label mb-1 flex items-center gap-1.5 text-[11px]"><Instagram className="h-3 w-3" /> Instagram URL</label>
            <input className="admin-input" value={settings.instagramUrl} onChange={(e) => update('instagramUrl', e.target.value)} placeholder="https://instagram.com/..." />
          </div>
        </div>
      </Section>

      {/* ── Footer Description ── */}
      <Section icon={FileText} title="Footer Description" subtitle="Company description text shown in the footer">
        <div>
          <label className="admin-label mb-1 block text-[11px]">Description</label>
          <textarea className="admin-textarea !min-h-[5rem]" value={settings.footerDescription} onChange={(e) => update('footerDescription', e.target.value)} placeholder="Company description..." rows={4} />
        </div>
      </Section>

      {/* ── Save Button ── */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#84cc16] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#65a30d] disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
        {saved && <span className="text-sm font-medium text-[#65a30d]">&#10003; Saved!</span>}
      </div>
    </div>
  )
}
