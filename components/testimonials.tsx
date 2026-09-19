'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import type { Testimonial } from '@/lib/data'

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [start, setStart] = useState(0)
  const perView = 3
  const maxStart = Math.max(0, items.length - perView)

  const visible = items.slice(start, start + perView)

  return (
    <section className="bg-lavender/50 py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-black text-foreground md:text-4xl">موثوق من أكثر من ١٠٠,٠٠٠ مبدع</h2>
        <p className="mt-2 text-muted-foreground">انشر تطبيقاتك أسرع من أي وقت.</p>
        <button className="mt-6 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-bold text-foreground transition-transform hover:scale-105 active:scale-95">
          ابدأ البناء
        </button>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {visible.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6 text-right shadow-sm">
              <p className="text-sm leading-relaxed text-foreground">”{t.text}“</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-gradient-to-br from-violet via-fuchsia-500 to-orange-400" />
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setStart((s) => Math.max(0, s - 1))}
            disabled={start === 0}
            aria-label="السابق"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
            disabled={start >= maxStart}
            aria-label="التالي"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
