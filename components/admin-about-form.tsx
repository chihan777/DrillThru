'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Target, Users, Award, Rocket, Plus, Pencil, Trash2, Save, X, Upload, Image as ImageIcon, FolderOpen, MessageSquareQuote } from 'lucide-react'
import {
  saveAboutSettings,
  createValue, updateValue, deleteValue,
  createTeamMember, updateTeamMember, deleteTeamMember,
  createProject, updateProject, deleteProject,
  createTestimonial, updateTestimonial, deleteTestimonial,
  uploadImage,
} from '@/app/actions/about'

const ICON_MAP: Record<string, React.ElementType> = {
  Target, Users, Award, Rocket,
}

const COLOR_OPTIONS = [
  { label: 'Blue/Purple', value: 'from-blue-500/20 to-purple-500/20' },
  { label: 'Orange/Red', value: 'from-orange-500/20 to-red-500/20' },
  { label: 'Green/Teal', value: 'from-green-500/20 to-teal-500/20' },
  { label: 'Pink/Rose', value: 'from-pink-500/20 to-rose-500/20' },
  { label: 'Lime/Green', value: 'from-lime-500/20 to-green-500/20' },
  { label: 'Cyan/Blue', value: 'from-cyan-500/20 to-blue-500/20' },
]

type Value = { id: number; icon: string; title: string; description: string; order: number }
type TeamMember = { id: number; name: string; role: string; initial: string; description: string | null; email: string | null; linkedin: string | null; github: string | null; image: string | null; order: number }
type Project = { id: number; title: string; category: string; description: string; image: string | null; link: string | null; color: string; order: number }
type Testimonial = { id: number; name: string; role: string; company: string | null; content: string; rating: number; image: string | null; order: number }

interface Props {
  settings: Record<string, string>
  values: Value[]
  team: TeamMember[]
  projects: Project[]
  testimonials: Testimonial[]
}

export function AdminAboutForm({ settings: initialSettings, values: initialValues, team: initialTeam, projects: initialProjects, testimonials: initialTestimonials }: Props) {
  const router = useRouter()

  // ── Settings State ──
  const [settings, setSettings] = useState(initialSettings)
  const [savingSettings, setSavingSettings] = useState(false)

  // ── Values State ──
  const [values, setValues] = useState(initialValues)
  const [editingValue, setEditingValue] = useState<Value | null>(null)
  const [showValueForm, setShowValueForm] = useState(false)
  const [valueForm, setValueForm] = useState({ icon: 'Target', title: '', description: '' })

  // ── Team State ──
  const [team, setTeam] = useState(initialTeam)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const emptyTeam = { name: '', role: '', initial: '', description: '', email: '', linkedin: '', github: '', image: '' }
  const [teamForm, setTeamForm] = useState(emptyTeam)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // ── Projects State ──
  const [projectList, setProjectList] = useState(initialProjects)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const emptyProject = { title: '', category: '', description: '', image: '', link: '', color: 'from-blue-500/20 to-purple-500/20' }
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [uploadingProject, setUploadingProject] = useState(false)
  const [projectImagePreview, setProjectImagePreview] = useState<string | null>(null)

  // ── Testimonials State ──
  const [testimonialList, setTestimonialList] = useState(initialTestimonials)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const emptyTestimonial = { name: '', role: '', company: '', content: '', rating: 5, image: '' }
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial)
  const [uploadingTestimonial, setUploadingTestimonial] = useState(false)
  const [testimonialImagePreview, setTestimonialImagePreview] = useState<string | null>(null)

  // ── Save Settings ──
  async function handleSaveSettings() {
    setSavingSettings(true)
    await saveAboutSettings(settings)
    setSavingSettings(false)
    router.refresh()
  }

  // ── Values CRUD ──
  async function handleSaveValue() {
    const fd = new FormData()
    fd.set('icon', valueForm.icon)
    fd.set('title', valueForm.title)
    fd.set('description', valueForm.description)

    if (editingValue) {
      const res = await updateValue(editingValue.id, fd)
      if (res.success) {
        setValues(values.map(v => v.id === editingValue.id ? { ...v, ...valueForm } : v))
        setEditingValue(null)
      }
    } else {
      const res = await createValue(fd)
      if (res.success) {
        setShowValueForm(false)
        router.refresh()
      }
    }
    setValueForm({ icon: 'Target', title: '', description: '' })
  }

  async function handleDeleteValue(id: number) {
    if (!confirm('Delete this value?')) return
    const res = await deleteValue(id)
    if (res.success) setValues(values.filter(v => v.id !== id))
  }

  function startEditValue(v: Value) {
    setEditingValue(v)
    setValueForm({ icon: v.icon, title: v.title, description: v.description })
    setShowValueForm(false)
  }

  // ── Image Upload (shared) ──
  async function doImageUpload(file: File): Promise<string | null> {
    try {
      const result = await uploadImage(file)
      if (result.success && result.url) {
        console.log('Upload successful:', result.url)
        return result.url
      } else {
        console.error('Upload failed:', result.error)
        alert(`Upload failed: ${result.error || 'Unknown error'}`)
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    }
  }

  // ── Team CRUD ──
  async function handleTeamImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }
    console.log('Starting upload for file:', file.name, file.size)
    setUploading(true)
    const url = await doImageUpload(file)
    setUploading(false)
    if (url) {
      console.log('Setting image URL:', url)
      setTeamForm({ ...teamForm, image: url })
      setImagePreview(url)
    } else {
      console.log('Upload returned null')
    }
  }

  async function handleSaveTeam() {
    const fd = new FormData()
    fd.set('name', teamForm.name)
    fd.set('role', teamForm.role)
    fd.set('initial', teamForm.initial)
    fd.set('description', teamForm.description)
    fd.set('email', teamForm.email)
    fd.set('linkedin', teamForm.linkedin)
    fd.set('github', teamForm.github)
    fd.set('image', teamForm.image)

    if (editingMember) {
      const res = await updateTeamMember(editingMember.id, fd)
      if (res.success) {
        setTeam(team.map(t => t.id === editingMember.id
          ? { ...t, ...teamForm, initial: teamForm.initial.toUpperCase().slice(0, 2), image: teamForm.image || null, description: teamForm.description || null, email: teamForm.email || null, linkedin: teamForm.linkedin || null, github: teamForm.github || null }
          : t))
        setEditingMember(null)
      }
    } else {
      const res = await createTeamMember(fd)
      if (res.success) { setShowTeamForm(false); router.refresh() }
    }
    setTeamForm(emptyTeam); setImagePreview(null)
  }

  async function handleDeleteTeam(id: number) {
    if (!confirm('Delete this team member?')) return
    const res = await deleteTeamMember(id)
    if (res.success) setTeam(team.filter(t => t.id !== id))
  }

  function startEditMember(m: TeamMember) {
    setEditingMember(m)
    setTeamForm({ name: m.name, role: m.role, initial: m.initial, description: m.description || '', email: m.email || '', linkedin: m.linkedin || '', github: m.github || '', image: m.image || '' })
    setImagePreview(m.image)
    setShowTeamForm(false)
  }

  // ── Projects CRUD ──
  async function handleProjectImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingProject(true)
    const url = await doImageUpload(file)
    setUploadingProject(false)
    if (url) {
      setProjectForm({ ...projectForm, image: url })
      setProjectImagePreview(url)
    }
  }

  async function handleSaveProject() {
    const fd = new FormData()
    fd.set('title', projectForm.title)
    fd.set('category', projectForm.category)
    fd.set('description', projectForm.description)
    fd.set('image', projectForm.image)
    fd.set('link', projectForm.link)
    fd.set('color', projectForm.color)

    if (editingProject) {
      const res = await updateProject(editingProject.id, fd)
      if (res.success) {
        setProjectList(projectList.map(p => p.id === editingProject.id
          ? { ...p, ...projectForm, image: projectForm.image || null, link: projectForm.link || null }
          : p))
        setEditingProject(null)
      }
    } else {
      const res = await createProject(fd)
      if (res.success) { setShowProjectForm(false); router.refresh() }
    }
    setProjectForm(emptyProject); setProjectImagePreview(null)
  }

  async function handleDeleteProject(id: number) {
    if (!confirm('Delete this project?')) return
    const res = await deleteProject(id)
    if (res.success) setProjectList(projectList.filter(p => p.id !== id))
  }

  function startEditProject(p: Project) {
    setEditingProject(p)
    setProjectForm({ title: p.title, category: p.category, description: p.description, image: p.image || '', link: p.link || '', color: p.color })
    setProjectImagePreview(p.image)
    setShowProjectForm(false)
  }

  // ── Testimonials CRUD ──
  async function handleTestimonialImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingTestimonial(true)
    const url = await doImageUpload(file)
    setUploadingTestimonial(false)
    if (url) {
      setTestimonialForm({ ...testimonialForm, image: url })
      setTestimonialImagePreview(url)
    }
  }

  async function handleSaveTestimonial() {
    const fd = new FormData()
    fd.set('name', testimonialForm.name)
    fd.set('role', testimonialForm.role)
    fd.set('company', testimonialForm.company)
    fd.set('content', testimonialForm.content)
    fd.set('rating', String(testimonialForm.rating))
    fd.set('image', testimonialForm.image)

    if (editingTestimonial) {
      const res = await updateTestimonial(editingTestimonial.id, fd)
      if (res.success) {
        setTestimonialList(testimonialList.map(t => t.id === editingTestimonial.id
          ? { ...t, ...testimonialForm, company: testimonialForm.company || null, image: testimonialForm.image || null }
          : t))
        setEditingTestimonial(null)
      }
    } else {
      const res = await createTestimonial(fd)
      if (res.success) { setShowTestimonialForm(false); router.refresh() }
    }
    setTestimonialForm(emptyTestimonial); setTestimonialImagePreview(null)
  }

  async function handleDeleteTestimonial(id: number) {
    if (!confirm('Delete this testimonial?')) return
    const res = await deleteTestimonial(id)
    if (res.success) setTestimonialList(testimonialList.filter(t => t.id !== id))
  }

  function startEditTestimonial(t: Testimonial) {
    setEditingTestimonial(t)
    setTestimonialForm({ name: t.name, role: t.role, company: t.company || '', content: t.content, rating: t.rating, image: t.image || '' })
    setTestimonialImagePreview(t.image)
    setShowTestimonialForm(false)
  }

  return (
    <div className="space-y-8">
      {/* ── Section Text Settings ── */}
      <div className="admin-card p-6">
        <h2 className="mb-6 text-lg font-semibold text-black">Section Text</h2>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Heading</label>
            <input className="admin-input text-black" value={settings.heading ?? 'believes in Nepal'} onChange={(e) => setSettings({ ...settings, heading: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Subtitle</label>
            <textarea className="admin-textarea min-h-[80px] text-black" value={settings.subtitle ?? ''} onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} placeholder="Section subtitle..." />
          </div>
          <div>
            <label className="admin-label">Story Heading</label>
            <input className="admin-input text-black" value={settings.storyHeading ?? 'Our Story'} onChange={(e) => setSettings({ ...settings, storyHeading: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Story Paragraph 1</label>
            <textarea className="admin-textarea min-h-[80px] text-black" value={settings.storyP1 ?? ''} onChange={(e) => setSettings({ ...settings, storyP1: e.target.value })} placeholder="First paragraph..." />
          </div>
          <div>
            <label className="admin-label">Story Paragraph 2</label>
            <textarea className="admin-textarea min-h-[80px] text-black" value={settings.storyP2 ?? ''} onChange={(e) => setSettings({ ...settings, storyP2: e.target.value })} placeholder="Second paragraph..." />
          </div>
          <div>
            <label className="admin-label">Story Paragraph 3</label>
            <textarea className="admin-textarea min-h-[80px] text-black" value={settings.storyP3 ?? ''} onChange={(e) => setSettings({ ...settings, storyP3: e.target.value })} placeholder="Third paragraph..." />
          </div>
          <div>
            <label className="admin-label">Team Heading</label>
            <input className="admin-input text-black" value={settings.teamHeading ?? 'Meet the Team'} onChange={(e) => setSettings({ ...settings, teamHeading: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Work Section Heading</label>
            <input className="admin-input text-black" value={settings.workHeading ?? 'Projects that speak for themselves'} onChange={(e) => setSettings({ ...settings, workHeading: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Work Section Subtitle</label>
            <textarea className="admin-textarea min-h-[60px] text-black" value={settings.workSubtitle ?? ''} onChange={(e) => setSettings({ ...settings, workSubtitle: e.target.value })} placeholder="Work section subtitle..." />
          </div>
          <div>
            <label className="admin-label">Testimonial Heading</label>
            <input className="admin-input text-black" value={settings.testimonialHeading ?? 'Trusted by businesses across Nepal'} onChange={(e) => setSettings({ ...settings, testimonialHeading: e.target.value })} />
          </div>
          <button onClick={handleSaveSettings} disabled={savingSettings} className="admin-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            <Save className="h-4 w-4" />{savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* ── Values ── */}
      <div className="admin-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">Values</h2>
          <button onClick={() => { setShowValueForm(true); setEditingValue(null); setValueForm({ icon: 'Target', title: '', description: '' }) }} className="admin-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" /> Add Value
          </button>
        </div>
        <div className="space-y-3">
          {values.map((v) => {
            const Icon = ICON_MAP[v.icon] || Target
            return (
              <div key={v.id} className="flex items-center gap-4 rounded-xl border border-[#e2edcf] bg-white/50 p-4">
                <Icon className="h-6 w-6 shrink-0 text-[#84cc16]" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-black">{v.title}</h4>
                  <p className="truncate text-xs text-[#6b7f5e]">{v.description}</p>
                </div>
                <button onClick={() => startEditValue(v)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-[#84cc16]/10 hover:text-[#84cc16]"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDeleteValue(v.id)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            )
          })}
          {values.length === 0 && <p className="text-center text-sm text-[#6b7f5e]">No values added yet.</p>}
        </div>
        {(showValueForm || editingValue) && (
          <div className="mt-4 rounded-xl border border-[#e2edcf] bg-white/80 p-4">
            <h3 className="mb-3 text-sm font-semibold text-black">{editingValue ? 'Edit Value' : 'New Value'}</h3>
            <div className="space-y-3">
              <div><label className="admin-label">Icon</label><select className="admin-input text-black" value={valueForm.icon} onChange={(e) => setValueForm({ ...valueForm, icon: e.target.value })}>{Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}</select></div>
              <div><label className="admin-label">Title</label><input className="admin-input text-black" value={valueForm.title} onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })} placeholder="e.g. Results-Driven" /></div>
              <div><label className="admin-label">Description</label><textarea className="admin-textarea min-h-[60px] text-black" value={valueForm.description} onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })} placeholder="Short description..." /></div>
              <div className="flex gap-2">
                <button onClick={handleSaveValue} className="admin-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"><Save className="h-3.5 w-3.5" /> Save</button>
                <button onClick={() => { setShowValueForm(false); setEditingValue(null) }} className="admin-btn-outline inline-flex items-center gap-2 px-4 py-2 text-sm"><X className="h-3.5 w-3.5" /> Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Team Members ── */}
      <div className="admin-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">Team Members</h2>
          <button onClick={() => { setShowTeamForm(true); setEditingMember(null); setTeamForm(emptyTeam); setImagePreview(null) }} className="admin-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" /> Add Member
          </button>
        </div>
        <div className="space-y-3">
          {team.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-xl border border-[#e2edcf] bg-white/50 p-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#84cc16]/10">
                {m.image ? <img src={m.image} alt={m.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#84cc16]">{m.initial}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-black">{m.name}</h4>
                <p className="text-xs text-[#6b7f5e]">{m.role}</p>
                {(m.email || m.linkedin || m.github) && (
                  <div className="mt-1 flex gap-2 text-xs text-[#84cc16]">
                    {m.email && <span>Gmail</span>}
                    {m.linkedin && <span>LinkedIn</span>}
                    {m.github && <span>GitHub</span>}
                  </div>
                )}
              </div>
              <button onClick={() => startEditMember(m)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-[#84cc16]/10 hover:text-[#84cc16]"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDeleteTeam(m.id)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {team.length === 0 && <p className="text-center text-sm text-[#6b7f5e]">No team members added yet.</p>}
        </div>
        {(showTeamForm || editingMember) && (
          <div className="mt-4 rounded-xl border border-[#e2edcf] bg-white/80 p-4">
            <h3 className="mb-3 text-sm font-semibold text-black">{editingMember ? 'Edit Member' : 'New Team Member'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">Name</label><input className="admin-input text-black" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="e.g. Rohan Sharma" /></div>
                <div><label className="admin-label">Role</label><input className="admin-input text-black" value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} placeholder="e.g. Lead Developer" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">Initials</label><input className="admin-input text-black" value={teamForm.initial} onChange={(e) => setTeamForm({ ...teamForm, initial: e.target.value })} placeholder="RS" maxLength={2} /></div>
                <div><label className="admin-label">Gmail / Email</label><input className="admin-input text-black" value={teamForm.email} onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })} placeholder="name@gmail.com" /></div>
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea className="admin-textarea min-h-[60px] text-black" value={teamForm.description} onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })} placeholder="Short bio about this person..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">LinkedIn URL</label><input className="admin-input text-black" value={teamForm.linkedin} onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
                <div><label className="admin-label">GitHub URL</label><input className="admin-input text-black" value={teamForm.github} onChange={(e) => setTeamForm({ ...teamForm, github: e.target.value })} placeholder="https://github.com/..." /></div>
              </div>
              <div>
                <label className="admin-label">Photo</label>
                <div className="mt-1 flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#e2edcf]"><img src={imagePreview} alt="Preview" className="h-full w-full object-cover" /></div>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-[#e2edcf] bg-white/50"><ImageIcon className="h-6 w-6 text-[#94a388]" /></div>
                  )}
                  <div className="flex-1">
                    <label className="admin-btn-outline inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm">
                      <Upload className="h-3.5 w-3.5" />{uploading ? 'Uploading...' : 'Choose Image'}
                      <input type="file" accept="image/*" onChange={handleTeamImageUpload} className="hidden" disabled={uploading} />
                    </label>
                    {teamForm.image && <p className="mt-1 text-xs text-[#6b7f5e]">{teamForm.image}</p>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveTeam} className="admin-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"><Save className="h-3.5 w-3.5" /> Save</button>
                <button onClick={() => { setShowTeamForm(false); setEditingMember(null); setTeamForm(emptyTeam); setImagePreview(null) }} className="admin-btn-outline inline-flex items-center gap-2 px-4 py-2 text-sm"><X className="h-3.5 w-3.5" /> Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Projects (Our Work) ── */}
      <div className="admin-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-[#84cc16]" />
            <h2 className="text-lg font-semibold text-black">Projects (Our Work)</h2>
          </div>
          <button onClick={() => { setShowProjectForm(true); setEditingProject(null); setProjectForm(emptyProject); setProjectImagePreview(null) }} className="admin-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" /> Add Project
          </button>
        </div>
        <div className="space-y-3">
          {projectList.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl border border-[#e2edcf] bg-white/50 p-4">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br bg-white">
                {p.image ? <img src={p.image} alt={p.title} className="h-full w-full object-cover" /> : <div className={`h-full w-full bg-gradient-to-br ${p.color}`} />}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-black">{p.title}</h4>
                <p className="text-xs text-[#84cc16]">{p.category}</p>
                <p className="truncate text-xs text-[#6b7f5e]">{p.description}</p>
              </div>
              {p.link && <span className="shrink-0 rounded-full bg-[#84cc16]/10 px-2 py-0.5 text-xs font-medium text-[#84cc16]">Has Link</span>}
              <button onClick={() => startEditProject(p)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-[#84cc16]/10 hover:text-[#84cc16]"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDeleteProject(p.id)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {projectList.length === 0 && <p className="text-center text-sm text-[#6b7f5e]">No projects added yet.</p>}
        </div>
        {(showProjectForm || editingProject) && (
          <div className="mt-4 rounded-xl border border-[#e2edcf] bg-white/80 p-4">
            <h3 className="mb-3 text-sm font-semibold text-black">{editingProject ? 'Edit Project' : 'New Project'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">Title</label><input className="admin-input text-black" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="e.g. Himalayan Trails" /></div>
                <div><label className="admin-label">Category</label><input className="admin-input text-black" value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} placeholder="e.g. Web Development + SEO" /></div>
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea className="admin-textarea min-h-[60px] text-black" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Project description..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Project Link (optional)</label>
                  <input className="admin-input text-black" value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} placeholder="https://... (leave empty if no link)" />
                  <p className="mt-1 text-xs text-[#6b7f5e]">Add link for web projects. Leave empty for non-web projects.</p>
                </div>
                <div>
                  <label className="admin-label">Color Theme</label>
                  <select className="admin-input text-black" value={projectForm.color} onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}>
                    {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="admin-label">Project Image</label>
                <div className="mt-1 flex items-center gap-4">
                  {projectImagePreview ? (
                    <div className="relative h-20 w-28 overflow-hidden rounded-xl border border-[#e2edcf]"><img src={projectImagePreview} alt="Preview" className="h-full w-full object-cover" /></div>
                  ) : (
                    <div className="flex h-20 w-28 items-center justify-center rounded-xl border-2 border-dashed border-[#e2edcf] bg-white/50"><ImageIcon className="h-6 w-6 text-[#94a388]" /></div>
                  )}
                  <div className="flex-1">
                    <label className="admin-btn-outline inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm">
                      <Upload className="h-3.5 w-3.5" />{uploadingProject ? 'Uploading...' : 'Choose Image'}
                      <input type="file" accept="image/*" onChange={handleProjectImageUpload} className="hidden" disabled={uploadingProject} />
                    </label>
                    {projectForm.image && <p className="mt-1 text-xs text-[#6b7f5e]">{projectForm.image}</p>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveProject} className="admin-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"><Save className="h-3.5 w-3.5" /> Save</button>
                <button onClick={() => { setShowProjectForm(false); setEditingProject(null); setProjectForm(emptyProject); setProjectImagePreview(null) }} className="admin-btn-outline inline-flex items-center gap-2 px-4 py-2 text-sm"><X className="h-3.5 w-3.5" /> Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Testimonials ── */}
      <div className="admin-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-[#84cc16]" />
            <h2 className="text-lg font-semibold text-black">Testimonials</h2>
          </div>
          <button onClick={() => { setShowTestimonialForm(true); setEditingTestimonial(null); setTestimonialForm(emptyTestimonial); setTestimonialImagePreview(null) }} className="admin-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" /> Add Testimonial
          </button>
        </div>
        <div className="space-y-3">
          {testimonialList.map((t) => (
            <div key={t.id} className="flex items-center gap-4 rounded-xl border border-[#e2edcf] bg-white/50 p-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#84cc16]/10">
                {t.image ? <img src={t.image} alt={t.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#84cc16]">{t.name.split(' ').map(n => n[0]).join('')}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-black">{t.name}</h4>
                <p className="text-xs text-[#84cc16]">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                <p className="truncate text-xs text-[#6b7f5e]">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-1 flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => <span key={i} className="text-xs text-[#84cc16]">&#9733;</span>)}
                </div>
              </div>
              <button onClick={() => startEditTestimonial(t)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-[#84cc16]/10 hover:text-[#84cc16]"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDeleteTestimonial(t.id)} className="rounded-lg p-2 text-[#6b7f5e] hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {testimonialList.length === 0 && <p className="text-center text-sm text-[#6b7f5e]">No testimonials added yet.</p>}
        </div>
        {(showTestimonialForm || editingTestimonial) && (
          <div className="mt-4 rounded-xl border border-[#e2edcf] bg-white/80 p-4">
            <h3 className="mb-3 text-sm font-semibold text-black">{editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">Name</label><input className="admin-input text-black" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} placeholder="e.g. Bikash Shrestha" /></div>
                <div><label className="admin-label">Role / Title</label><input className="admin-input text-black" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} placeholder="e.g. CEO" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">Company</label><input className="admin-input text-black" value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} placeholder="e.g. Himalayan Adventures" /></div>
                <div>
                  <label className="admin-label">Rating (1-5)</label>
                  <select className="admin-input text-black" value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="admin-label">Testimonial Content</label>
                <textarea className="admin-textarea min-h-[80px] text-black" value={testimonialForm.content} onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })} placeholder="What did they say about your work..." />
              </div>
              <div>
                <label className="admin-label">Photo (optional)</label>
                <div className="mt-1 flex items-center gap-4">
                  {testimonialImagePreview ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[#e2edcf]"><img src={testimonialImagePreview} alt="Preview" className="h-full w-full object-cover" /></div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#e2edcf] bg-white/50"><ImageIcon className="h-5 w-5 text-[#94a388]" /></div>
                  )}
                  <div className="flex-1">
                    <label className="admin-btn-outline inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm">
                      <Upload className="h-3.5 w-3.5" />{uploadingTestimonial ? 'Uploading...' : 'Choose Image'}
                      <input type="file" accept="image/*" onChange={handleTestimonialImageUpload} className="hidden" disabled={uploadingTestimonial} />
                    </label>
                    {testimonialForm.image && <p className="mt-1 text-xs text-[#6b7f5e]">{testimonialForm.image}</p>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveTestimonial} className="admin-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"><Save className="h-3.5 w-3.5" /> Save</button>
                <button onClick={() => { setShowTestimonialForm(false); setEditingTestimonial(null); setTestimonialForm(emptyTestimonial); setTestimonialImagePreview(null) }} className="admin-btn-outline inline-flex items-center gap-2 px-4 py-2 text-sm"><X className="h-3.5 w-3.5" /> Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
