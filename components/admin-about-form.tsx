'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Target, Users, Award, Rocket, Plus, Pencil, Trash2, Save, X, Upload,
  Image as ImageIcon, MessageSquareQuote, ChevronDown, ChevronUp,
  Type, Users2, Star, Loader2,
} from 'lucide-react'
import {
  saveAboutSettings,
  createValue, updateValue, deleteValue,
  createTeamMember, updateTeamMember, deleteTeamMember,
  createTestimonial, updateTestimonial, deleteTestimonial,
  uploadImage,
} from '@/app/actions/about'

const ICON_MAP: Record<string, React.ElementType> = { Target, Users, Award, Rocket }
type Value = { id: number; icon: string; title: string; description: string; order: number }
type TeamMember = { id: number; name: string; role: string; initial: string; description: string | null; email: string | null; linkedin: string | null; github: string | null; image: string | null; order: number }
type Testimonial = { id: number; name: string; role: string; company: string | null; content: string; rating: number; image: string | null; order: number }

interface Props {
  settings: Record<string, string>
  values: Value[]
  team: TeamMember[]
  testimonials: Testimonial[]
}

/* ── Collapsible Section ─────────────────────────────────────────────────── */
function Section({ icon: Icon, title, subtitle, children, defaultOpen = false, count }: {
  icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode; defaultOpen?: boolean; count?: number
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
          {count !== undefined && count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#84cc16] px-1.5 text-[10px] font-bold text-white">{count}</span>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-[#6b7f5e]" /> : <ChevronDown className="h-4 w-4 text-[#6b7f5e]" />}
        </div>
      </button>
      {open && <div className="border-t border-[#e2edcf] p-5">{children}</div>}
    </div>
  )
}

export function AdminAboutForm({ settings: initialSettings, values: initialValues, team: initialTeam, testimonials: initialTestimonials }: Props) {
  const router = useRouter()

  const defaultSettings = {
    heading: '',
    storyHeading: '',
    subtitle: '',
    storyP1: '',
    storyP2: '',
    storyP3: '',
    teamHeading: '',
    testimonialHeading: '',
    workHeading: '',
    workSubtitle: '',
  }

  const [settings, setSettings] = useState({ ...defaultSettings, ...initialSettings })
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const [values, setValues] = useState(initialValues)
  const [editingValue, setEditingValue] = useState<Value | null>(null)
  const [showValueForm, setShowValueForm] = useState(false)
  const [valueForm, setValueForm] = useState({ icon: 'Target', title: '', description: '' })

  const [team, setTeam] = useState(initialTeam)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const emptyTeam = { name: '', role: '', initial: '', description: '', email: '', linkedin: '', github: '', image: '' }
  const [teamForm, setTeamForm] = useState(emptyTeam)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [testimonialList, setTestimonialList] = useState(initialTestimonials)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const emptyTestimonial = { name: '', role: '', company: '', content: '', rating: 5, image: '' }
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial)
  const [uploadingTestimonial, setUploadingTestimonial] = useState(false)
  const [testimonialImagePreview, setTestimonialImagePreview] = useState<string | null>(null)

  function showError(message: string) {
    setActionError(message)
    setTimeout(() => setActionError(null), 5000)
  }

  async function handleSaveSettings() {
    setSavingSettings(true)
    try {
      await saveAboutSettings(settings)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 2000)
      router.refresh()
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save settings.')
    } finally {
      setSavingSettings(false)
    }
  }

  async function compressImage(file: File, maxWidthPx = 1200, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const scale = Math.min(1, maxWidthPx / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            resolve(new File([blob], file.name, { type: 'image/webp', lastModified: Date.now() }))
          },
          'image/webp',
          quality,
        )
      }
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
      img.src = url
    })
  }

  async function doImageUpload(file: File): Promise<string | null> {
    try {
      const compressed = await compressImage(file)
      const result = await uploadImage(compressed)
      if (result.success && result.url) return result.url
      alert(`Upload failed: ${result.error || 'Unknown error'}`)
      return null
    } catch (error) {
      alert(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    }
  }

  // ── Values CRUD ──
  async function handleSaveValue() {
    setActionError(null)
    const fd = new FormData()
    fd.set('icon', valueForm.icon); fd.set('title', valueForm.title); fd.set('description', valueForm.description)
    if (editingValue) {
      const res = await updateValue(editingValue.id, fd)
      if (res.success) {
        setValues(values.map(v => v.id === editingValue.id ? { ...v, ...valueForm } : v))
        setEditingValue(null)
      } else {
        showError(res.error || 'Failed to update value.')
      }
    } else {
      const res = await createValue(fd)
      if (res.success) {
        setShowValueForm(false)
        router.refresh()
      } else {
        showError(res.error || 'Failed to create value.')
      }
    }
    setValueForm({ icon: 'Target', title: '', description: '' })
  }

  async function handleDeleteValue(id: number) {
    if (!confirm('Delete this value?')) return
    const res = await deleteValue(id)
    if (res.success) {
      setValues(values.filter(v => v.id !== id))
    } else {
      showError(res.error || 'Failed to delete value.')
    }
  }

  function startEditValue(v: Value) {
    setEditingValue(v)
    setValueForm({ icon: v.icon, title: v.title, description: v.description })
    setShowValueForm(true)
  }

  // ── Team CRUD ──
  async function handleTeamImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true); const url = await doImageUpload(file); setUploading(false)
    if (url) { setTeamForm({ ...teamForm, image: url }); setImagePreview(url) }
  }
  async function handleSaveTeam() {
    setActionError(null)
    const fd = new FormData()
    fd.set('name', teamForm.name); fd.set('role', teamForm.role); fd.set('initial', teamForm.initial)
    fd.set('description', teamForm.description); fd.set('email', teamForm.email); fd.set('linkedin', teamForm.linkedin)
    fd.set('github', teamForm.github); fd.set('image', teamForm.image)
    if (editingMember) {
      const res = await updateTeamMember(editingMember.id, fd)
      if (res.success) {
        setTeam(team.map(t => t.id === editingMember.id ? { ...t, ...teamForm, initial: teamForm.initial.toUpperCase().slice(0, 2), image: teamForm.image || null, description: teamForm.description || null, email: teamForm.email || null, linkedin: teamForm.linkedin || null, github: teamForm.github || null } : t))
        setEditingMember(null)
      } else {
        showError(res.error || 'Failed to update team member.')
      }
    } else {
      const res = await createTeamMember(fd)
      if (res.success) {
        setShowTeamForm(false)
        router.refresh()
      } else {
        showError(res.error || 'Failed to create team member.')
      }
    }
    setTeamForm(emptyTeam)
    setImagePreview(null)
  }

  async function handleDeleteTeam(id: number) {
    if (!confirm('Delete this team member?')) return
    const res = await deleteTeamMember(id)
    if (res.success) {
      setTeam(team.filter(t => t.id !== id))
    } else {
      showError(res.error || 'Failed to delete team member.')
    }
  }

  function startEditMember(m: TeamMember) {
    setEditingMember(m)
    setTeamForm({ name: m.name, role: m.role, initial: m.initial, description: m.description || '', email: m.email || '', linkedin: m.linkedin || '', github: m.github || '', image: m.image || '' })
    setImagePreview(m.image)
    setShowTeamForm(true)
  }

  // ── Projects CRUD ──
  // ── Testimonials CRUD ──
  async function handleTestimonialImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingTestimonial(true); const url = await doImageUpload(file); setUploadingTestimonial(false)
    if (url) { setTestimonialForm({ ...testimonialForm, image: url }); setTestimonialImagePreview(url) }
  }
  async function handleSaveTestimonial() {
    setActionError(null)
    const fd = new FormData()
    fd.set('name', testimonialForm.name); fd.set('role', testimonialForm.role); fd.set('company', testimonialForm.company)
    fd.set('content', testimonialForm.content); fd.set('rating', String(testimonialForm.rating)); fd.set('image', testimonialForm.image)
    if (editingTestimonial) {
      const res = await updateTestimonial(editingTestimonial.id, fd)
      if (res.success) {
        setTestimonialList(testimonialList.map(t => t.id === editingTestimonial.id ? { ...t, ...testimonialForm, company: testimonialForm.company || null, image: testimonialForm.image || null } : t))
        setEditingTestimonial(null)
      } else {
        showError(res.error || 'Failed to update testimonial.')
      }
    } else {
      const res = await createTestimonial(fd)
      if (res.success) {
        setShowTestimonialForm(false)
        router.refresh()
      } else {
        showError(res.error || 'Failed to create testimonial.')
      }
    }
    setTestimonialForm(emptyTestimonial)
    setTestimonialImagePreview(null)
  }

  async function handleDeleteTestimonial(id: number) {
    if (!confirm('Delete this testimonial?')) return
    const res = await deleteTestimonial(id)
    if (res.success) {
      setTestimonialList(testimonialList.filter(t => t.id !== id))
    } else {
      showError(res.error || 'Failed to delete testimonial.')
    }
  }

  function startEditTestimonial(t: Testimonial) {
    setEditingTestimonial(t)
    setTestimonialForm({ name: t.name, role: t.role, company: t.company || '', content: t.content, rating: t.rating, image: t.image || '' })
    setTestimonialImagePreview(t.image)
    setShowTestimonialForm(true)
  }

  return (
    <div className="space-y-5">
      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}
      {/* ── Section Text Settings ── */}
      <Section icon={Type} title="Section Text" subtitle="Headings, story paragraphs, and section titles" defaultOpen>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label mb-1 block text-[11px]">Heading</label>
            <input className="admin-input" value={settings.heading ?? 'believes in Nepal'} onChange={(e) => setSettings({ ...settings, heading: e.target.value })} />
          </div>
          <div>
            <label className="admin-label mb-1 block text-[11px]">Story Heading</label>
            <input className="admin-input" value={settings.storyHeading ?? 'Our Story'} onChange={(e) => setSettings({ ...settings, storyHeading: e.target.value })} />
          </div>
        </div>
        <div className="mt-4">
          <label className="admin-label mb-1 block text-[11px]">Subtitle</label>
          <textarea className="admin-textarea !min-h-[3.5rem]" value={settings.subtitle ?? ''} onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} placeholder="Section subtitle..." rows={2} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="admin-label mb-1 block text-[11px]">Story Paragraph 1</label>
            <textarea className="admin-textarea !min-h-[5rem]" value={settings.storyP1 ?? ''} onChange={(e) => setSettings({ ...settings, storyP1: e.target.value })} placeholder="First paragraph..." rows={4} />
          </div>
          <div>
            <label className="admin-label mb-1 block text-[11px]">Story Paragraph 2</label>
            <textarea className="admin-textarea !min-h-[5rem]" value={settings.storyP2 ?? ''} onChange={(e) => setSettings({ ...settings, storyP2: e.target.value })} placeholder="Second paragraph..." rows={4} />
          </div>
          <div>
            <label className="admin-label mb-1 block text-[11px]">Story Paragraph 3</label>
            <textarea className="admin-textarea !min-h-[5rem]" value={settings.storyP3 ?? ''} onChange={(e) => setSettings({ ...settings, storyP3: e.target.value })} placeholder="Third paragraph..." rows={4} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label mb-1 block text-[11px]">Team Heading</label>
            <input className="admin-input" value={settings.teamHeading ?? 'Meet the Team'} onChange={(e) => setSettings({ ...settings, teamHeading: e.target.value })} />
          </div>
          <div>
            <label className="admin-label mb-1 block text-[11px]">Testimonial Heading</label>
            <input className="admin-input" value={settings.testimonialHeading ?? 'Trusted by businesses across Nepal'} onChange={(e) => setSettings({ ...settings, testimonialHeading: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label mb-1 block text-[11px]">Work Section Heading</label>
            <input className="admin-input" value={settings.workHeading ?? 'Projects that speak for themselves'} onChange={(e) => setSettings({ ...settings, workHeading: e.target.value })} />
          </div>
          <div>
            <label className="admin-label mb-1 block text-[11px]">Work Section Subtitle</label>
            <textarea className="admin-textarea !min-h-[3.5rem]" value={settings.workSubtitle ?? ''} onChange={(e) => setSettings({ ...settings, workSubtitle: e.target.value })} placeholder="Work section subtitle..." rows={2} />
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button type="button" onClick={handleSaveSettings} disabled={savingSettings} className="flex items-center gap-2 rounded-lg bg-[#84cc16] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#65a30d] disabled:opacity-50">
            {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
          {settingsSaved && <span className="text-sm font-medium text-[#65a30d]">✓ Saved!</span>}
        </div>
      </Section>

      {/* ── Values ── */}
      <Section icon={Award} title="Values" subtitle="Core company values displayed on the about page" count={values.length}>
        <div className="space-y-3">
          {values.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e2edcf] py-8">
              <Award className="mb-2 h-8 w-8 text-[#c5e091]" />
              <p className="text-sm text-[#6b7f5e]">No values added yet</p>
            </div>
          )}
          {values.map((v) => {
            const Icon = ICON_MAP[v.icon] || Target
            return (
              <div key={v.id} className="group flex items-center gap-4 rounded-xl border border-[#e2edcf] bg-white/60 p-4 transition-all hover:border-[#c5e091]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#84cc16]/10">
                  <Icon className="h-5 w-5 text-[#84cc16]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-[#1a2e0a]">{v.title}</h4>
                  <p className="truncate text-xs text-[#6b7f5e]">{v.description}</p>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button" onClick={() => startEditValue(v)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-[#84cc16]/10 hover:text-[#84cc16]"><Pencil className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => handleDeleteValue(v.id)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            )
          })}
          {(showValueForm || editingValue) && (
            <div className="rounded-xl border border-[#c5e091] bg-[#f7faf3] p-4">
              <h3 className="mb-3 text-sm font-bold text-[#1a2e0a]">{editingValue ? 'Edit Value' : 'New Value'}</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="admin-label mb-1 block text-[11px]">Icon</label><select className="admin-input" value={valueForm.icon} onChange={(e) => setValueForm({ ...valueForm, icon: e.target.value })}>{Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}</select></div>
                  <div><label className="admin-label mb-1 block text-[11px]">Title</label><input className="admin-input" value={valueForm.title} onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })} placeholder="e.g. Results-Driven" /></div>
                </div>
                <div><label className="admin-label mb-1 block text-[11px]">Description</label><textarea className="admin-textarea !min-h-[3.5rem]" value={valueForm.description} onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })} placeholder="Short description..." rows={2} /></div>
                <div className="flex gap-2">
                  <button type="button" onClick={handleSaveValue} className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-4 py-2 text-xs font-medium text-white hover:bg-black"><Save className="h-3.5 w-3.5" /> Save</button>
                  <button type="button" onClick={() => { setShowValueForm(false); setEditingValue(null) }} className="flex items-center gap-1.5 rounded-lg border border-[#d4e4bc] px-4 py-2 text-xs font-medium text-[#1a2e0a] hover:bg-white"><X className="h-3.5 w-3.5" /> Cancel</button>
                </div>
              </div>
            </div>
          )}
          {!showValueForm && !editingValue && (
            <button type="button" onClick={() => { setShowValueForm(true); setEditingValue(null); setValueForm({ icon: 'Target', title: '', description: '' }) }} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c5e091] py-3 text-sm font-medium text-[#65a30d] transition-all hover:border-[#84cc16] hover:bg-[#84cc16]/5">
              <Plus className="h-4 w-4" /> Add Value
            </button>
          )}
        </div>
      </Section>

      {/* ── Team Members ── */}
      <Section icon={Users2} title="Team Members" subtitle="People behind the company" count={team.length}>
        <div className="space-y-3">
          {team.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e2edcf] py-8">
              <Users2 className="mb-2 h-8 w-8 text-[#c5e091]" />
              <p className="text-sm text-[#6b7f5e]">No team members yet</p>
            </div>
          )}
          {team.map((m) => (
            <div key={m.id} className="group flex items-center gap-4 rounded-xl border border-[#e2edcf] bg-white/60 p-4 transition-all hover:border-[#c5e091]">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#84cc16]/10">
                {m.image ? <img src={m.image} alt={m.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#84cc16]">{m.initial}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-[#1a2e0a]">{m.name}</h4>
                <p className="text-xs text-[#65a30d]">{m.role}</p>
                {(m.email || m.linkedin || m.github) && (
                  <div className="mt-0.5 flex gap-2 text-[10px] text-[#6b7f5e]">
                    {m.email && <span>Email</span>}{m.linkedin && <span>LinkedIn</span>}{m.github && <span>GitHub</span>}
                  </div>
                )}
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => startEditMember(m)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-[#84cc16]/10 hover:text-[#84cc16]"><Pencil className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => handleDeleteTeam(m.id)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
          {(showTeamForm || editingMember) && (
            <div className="rounded-xl border border-[#c5e091] bg-[#f7faf3] p-4">
              <h3 className="mb-3 text-sm font-bold text-[#1a2e0a]">{editingMember ? 'Edit Member' : 'New Team Member'}</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="admin-label mb-1 block text-[11px]">Name</label><input className="admin-input" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="e.g. Rohan Sharma" /></div>
                  <div><label className="admin-label mb-1 block text-[11px]">Role</label><input className="admin-input" value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} placeholder="e.g. Lead Developer" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="admin-label mb-1 block text-[11px]">Initials (max 2)</label><input className="admin-input" value={teamForm.initial} onChange={(e) => setTeamForm({ ...teamForm, initial: e.target.value })} placeholder="RS" maxLength={2} /></div>
                  <div><label className="admin-label mb-1 block text-[11px]">Email</label><input className="admin-input" value={teamForm.email} onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })} placeholder="name@example.com" /></div>
                </div>
                <div><label className="admin-label mb-1 block text-[11px]">Bio</label><textarea className="admin-textarea !min-h-[3.5rem]" value={teamForm.description} onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })} placeholder="Short bio..." rows={2} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="admin-label mb-1 block text-[11px]">LinkedIn</label><input className="admin-input" value={teamForm.linkedin} onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
                  <div><label className="admin-label mb-1 block text-[11px]">GitHub</label><input className="admin-input" value={teamForm.github} onChange={(e) => setTeamForm({ ...teamForm, github: e.target.value })} placeholder="https://github.com/..." /></div>
                </div>
                <div>
                  <label className="admin-label mb-1 block text-[11px]">Photo</label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-[#e2edcf]"><img src={imagePreview} alt="Preview" className="h-full w-full object-cover" /></div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-[#e2edcf] bg-white/50"><ImageIcon className="h-5 w-5 text-[#94a388]" /></div>
                    )}
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d4e4bc] px-4 py-2 text-xs font-medium text-[#1a2e0a] transition-colors hover:border-[#84cc16] hover:bg-[#84cc16]/5">
                      <Upload className="h-3.5 w-3.5" />{uploading ? 'Uploading...' : 'Upload Photo'}
                      <input type="file" accept="image/*" onChange={handleTeamImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={handleSaveTeam} className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-4 py-2 text-xs font-medium text-white hover:bg-black"><Save className="h-3.5 w-3.5" /> Save</button>
                  <button type="button" onClick={() => { setShowTeamForm(false); setEditingMember(null); setTeamForm(emptyTeam); setImagePreview(null) }} className="flex items-center gap-1.5 rounded-lg border border-[#d4e4bc] px-4 py-2 text-xs font-medium text-[#1a2e0a] hover:bg-white"><X className="h-3.5 w-3.5" /> Cancel</button>
                </div>
              </div>
            </div>
          )}
          {!showTeamForm && !editingMember && (
            <button type="button" onClick={() => { setShowTeamForm(true); setEditingMember(null); setTeamForm(emptyTeam); setImagePreview(null) }} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c5e091] py-3 text-sm font-medium text-[#65a30d] transition-all hover:border-[#84cc16] hover:bg-[#84cc16]/5">
              <Plus className="h-4 w-4" /> Add Team Member
            </button>
          )}
        </div>
      </Section>

      {/* ── Testimonials ── */}
      <Section icon={MessageSquareQuote} title="Testimonials" subtitle="Client reviews and ratings" count={testimonialList.length}>
        <div className="space-y-3">
          {testimonialList.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e2edcf] py-8">
              <MessageSquareQuote className="mb-2 h-8 w-8 text-[#c5e091]" />
              <p className="text-sm text-[#6b7f5e]">No testimonials yet</p>
            </div>
          )}
          {testimonialList.map((t) => (
            <div key={t.id} className="group flex items-center gap-4 rounded-xl border border-[#e2edcf] bg-white/60 p-4 transition-all hover:border-[#c5e091]">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#84cc16]/10">
                {t.image ? <img src={t.image} alt={t.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#84cc16]">{t.name.split(' ').map(n => n[0]).join('')}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-[#1a2e0a]">{t.name}</h4>
                <p className="text-[10px] font-medium text-[#65a30d]">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                <p className="truncate text-xs text-[#6b7f5e]">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-0.5 flex gap-0.5">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-[#84cc16] text-[#84cc16]" />)}</div>
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => startEditTestimonial(t)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-[#84cc16]/10 hover:text-[#84cc16]"><Pencil className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => handleDeleteTestimonial(t.id)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
          {(showTestimonialForm || editingTestimonial) && (
            <div className="rounded-xl border border-[#c5e091] bg-[#f7faf3] p-4">
              <h3 className="mb-3 text-sm font-bold text-[#1a2e0a]">{editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="admin-label mb-1 block text-[11px]">Name</label><input className="admin-input" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} placeholder="Client name" /></div>
                  <div><label className="admin-label mb-1 block text-[11px]">Role</label><input className="admin-input" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} placeholder="e.g. CEO" /></div>
                  <div><label className="admin-label mb-1 block text-[11px]">Company</label><input className="admin-input" value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} placeholder="Company name" /></div>
                </div>
                <div>
                  <label className="admin-label mb-1 block text-[11px]">Testimonial</label>
                  <textarea className="admin-textarea !min-h-[4rem]" value={testimonialForm.content} onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })} placeholder="What did they say..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="admin-label mb-1 block text-[11px]">Rating</label>
                    <div className="flex gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })} className={`h-6 w-6 transition-colors ${star <= testimonialForm.rating ? "text-[#84cc16]" : "text-[#e2edcf]"}`}>
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="admin-label mb-1 block text-[11px]">Photo (optional)</label>
                    <div className="flex items-center gap-3">
                      {testimonialImagePreview ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#e2edcf]"><img src={testimonialImagePreview} alt="Preview" className="h-full w-full object-cover" /></div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-[#e2edcf] bg-white/50"><ImageIcon className="h-4 w-4 text-[#94a388]" /></div>
                      )}
                      <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d4e4bc] px-3 py-1.5 text-[11px] font-medium text-[#1a2e0a] hover:border-[#84cc16]">
                        <Upload className="h-3 w-3" />{uploadingTestimonial ? 'Uploading...' : 'Upload'}
                        <input type="file" accept="image/*" onChange={handleTestimonialImageUpload} className="hidden" disabled={uploadingTestimonial} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={handleSaveTestimonial} className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-4 py-2 text-xs font-medium text-white hover:bg-black"><Save className="h-3.5 w-3.5" /> Save</button>
                  <button type="button" onClick={() => { setShowTestimonialForm(false); setEditingTestimonial(null); setTestimonialForm(emptyTestimonial); setTestimonialImagePreview(null) }} className="flex items-center gap-1.5 rounded-lg border border-[#d4e4bc] px-4 py-2 text-xs font-medium text-[#1a2e0a] hover:bg-white"><X className="h-3.5 w-3.5" /> Cancel</button>
                </div>
              </div>
            </div>
          )}
          {!showTestimonialForm && !editingTestimonial && (
            <button type="button" onClick={() => { setShowTestimonialForm(true); setEditingTestimonial(null); setTestimonialForm(emptyTestimonial); setTestimonialImagePreview(null) }} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c5e091] py-3 text-sm font-medium text-[#65a30d] transition-all hover:border-[#84cc16] hover:bg-[#84cc16]/5">
              <Plus className="h-4 w-4" /> Add Testimonial
            </button>
          )}
        </div>
      </Section>
    </div>
  )
}
