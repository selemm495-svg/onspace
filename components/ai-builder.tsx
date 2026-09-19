'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Paperclip,
  ArrowUp,
  Check,
  ChevronDown,
  Globe,
  Lock,
  Server,
  Monitor,
  Smartphone,
  Database,
  Code2,
  Loader2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FileUploadModal } from '@/components/file-upload-modal'
import { cn } from '@/lib/utils'

type Option = {
  value: string
  label: string
  desc?: string
  badge?: string
  icon?: LucideIcon
}

function Dropdown({
  options,
  value,
  onChange,
  triggerIcon: TriggerIcon,
  direction = 'up',
}: {
  options: Option[]
  value: string
  onChange: (v: string) => void
  triggerIcon?: LucideIcon
  direction?: 'up' | 'down'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const Icon = TriggerIcon ?? selected.icon

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
      >
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {selected.label}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            'animate-pop-in absolute z-30 min-w-56 rounded-2xl border border-border bg-popover p-1.5 shadow-xl',
            direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2',
            'left-0',
          )}
        >
          {options.map((o) => {
            const OIcon = o.icon
            const active = o.value === value
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-right transition-colors hover:bg-muted"
                >
                  {OIcon && <OIcon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  <span className="flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">{o.label}</span>
                      {o.badge && (
                        <span className="rounded-full bg-gradient-to-l from-violet to-fuchsia-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {o.badge}
                        </span>
                      )}
                    </span>
                    {o.desc && <span className="block text-xs text-muted-foreground">{o.desc}</span>}
                  </span>
                  {active && <Check className="h-4 w-4 text-violet" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const visibilityOptions: Option[] = [
  { value: 'public', label: 'عام', desc: 'أي حد يقدر يشوفه', icon: Globe },
  { value: 'private', label: 'خاص', desc: 'إنت بس اللي تشوفه', badge: 'PRO', icon: Lock },
]

const backendOptions: Option[] = [
  { value: 'cloud', label: 'سحابة', desc: 'مُدارة بالكامل', badge: 'جديد', icon: Server },
  { value: 'supabase', label: 'Supabase', icon: Database },
]

const platformOptions: Option[] = [
  { value: 'web', label: 'ويب', icon: Monitor },
  { value: 'mobile', label: 'iOS و أندرويد', icon: Smartphone },
]

const frameworkOptions: Option[] = [
  { value: 'react', label: 'React', icon: Code2 },
  { value: 'html', label: 'HTML', icon: Code2 },
]

export function AIBuilder({
  placeholder,
  controls = ['visibility', 'platform'],
  type = 'web',
}: {
  placeholder: string
  controls?: Array<'framework' | 'backend' | 'visibility' | 'platform'>
  type?: 'web' | 'mobile' | 'agentic'
}) {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [framework, setFramework] = useState('react')
  const [backend, setBackend] = useState('cloud')
  const [visibility, setVisibility] = useState('public')
  const [platform, setPlatform] = useState('web')
  const [createdProject, setCreatedProject] = useState<{ id: number; title: string } | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      if (typeof detail === 'string') setPrompt(detail)
    }
    window.addEventListener('onspace:prompt', handler)
    return () => window.removeEventListener('onspace:prompt', handler)
  }, [])

  const submit = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setCreatedProject(null)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type, platform, backend, visibility, framework }),
      })
      if (res.ok) {
        const project = await res.json()
        setCreatedProject(project)
        setPrompt('')
        router.refresh()
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {createdProject && (
        <div className="mb-3 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check className="h-4 w-4 shrink-0" />
          <span>تم إنشاء &quot;{createdProject.title}&quot; بنجاح! تجده في مشاريعك بالأسفل.</span>
        </div>
      )}

      <div className="group rounded-3xl border border-border bg-card p-3 shadow-xl shadow-violet/5 transition-shadow focus-within:border-violet/40 focus-within:shadow-violet/15">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={placeholder}
          rows={2}
          className="w-full resize-none bg-transparent px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
        />

        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="إرفاق ملف"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <Paperclip className="h-4.5 w-4.5" />
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {controls.includes('framework') && (
              <Dropdown options={frameworkOptions} value={framework} onChange={setFramework} />
            )}
            {controls.includes('backend') && (
              <Dropdown options={backendOptions} value={backend} onChange={setBackend} />
            )}
            {controls.includes('visibility') && (
              <Dropdown options={visibilityOptions} value={visibility} onChange={setVisibility} />
            )}
            {controls.includes('platform') && (
              <Dropdown options={platformOptions} value={platform} onChange={setPlatform} />
            )}
            <button
              type="button"
              onClick={submit}
              disabled={!prompt.trim() || loading}
              aria-label="إرسال"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet to-violet-soft text-white shadow-md transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <ArrowUp className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </div>

      <FileUploadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
