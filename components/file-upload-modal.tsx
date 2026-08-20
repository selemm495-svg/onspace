'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { UploadCloud, X, FileText, Trash2 } from 'lucide-react'

const ACCEPTED = '.png,.jpg,.jpeg,.webp,.svg,.gif,.pdf,.docx,.pptx,.xlsx,.txt,.md'

type UploadedFile = { id: string; name: string; size: number }

export function FileUploadModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return
    const next = Array.from(list).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
    }))
    setFiles((prev) => [...prev, ...next])
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
    >
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="animate-pop-in relative z-10 w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center">
          <h2 id="upload-title" className="text-lg font-bold text-foreground">
            رفع ملفات ذكي
          </h2>
          <p className="mt-1 text-sm text-violet">
            ارفع ملفاتك، والذكاء الاصطناعي هيحوّلها فورًا لصيغة منظّمة يقدر يقراها.
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            addFiles(e.dataTransfer.files)
          }}
          className={`mt-5 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            dragging ? 'border-violet bg-violet/5' : 'border-border bg-muted/40'
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet/15 to-fuchsia-400/15">
            <UploadCloud className="h-7 w-7 text-violet" />
          </div>
          <p className="mt-3 font-bold text-foreground">اسحب ملفاتك هنا</p>
          <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
            .png .jpg .jpeg .webp .svg .gif .pdf .docx .pptx .xlsx .txt .md
          </p>
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
          >
            <UploadCloud className="h-4 w-4" />
            اختار الملفات
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED}
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-violet" />
                  <span className="truncate text-sm text-foreground">{f.name}</span>
                </div>
                <button
                  onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                  aria-label={`حذف ${f.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex justify-start">
          <button
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}
