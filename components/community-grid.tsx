'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import type { CommunityProject } from '@/lib/data'

export function CommunityGrid({ projects }: { projects: CommunityProject[] }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? projects : projects.slice(0, 8)

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-2xl font-black text-foreground md:text-3xl">من المجتمع</h2>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p) => (
          <button
            key={p.title}
            className="group overflow-hidden rounded-2xl border border-border bg-card text-right shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${p.gradient}`}>
              <span className="text-2xl font-black text-white/40" dir="ltr">{p.emojiHint}</span>
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-lg">
                  <Eye className="h-3.5 w-3.5" /> معاينة
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 p-3">
              <span className="h-6 w-6 rounded-full bg-gradient-to-br from-violet to-fuchsia-400" />
              <span className="text-sm font-semibold text-foreground">{p.title}</span>
            </div>
          </button>
        ))}
      </div>

      {!showAll && projects.length > 8 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            عرض المزيد
          </button>
        </div>
      )}
    </section>
  )
}
