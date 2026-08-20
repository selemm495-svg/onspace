'use client'

import { Sparkles } from 'lucide-react'
import { agenticChips } from '@/lib/data'

export function ExampleChips() {
  return (
    <div className="mt-6">
      <p className="mb-3 text-center text-sm text-muted-foreground">اضغط عشان تبني</p>
      <div className="no-scrollbar flex flex-wrap justify-center gap-2.5 overflow-x-auto">
        {agenticChips.map((chip) => (
          <button
            key={chip.label}
            onClick={() =>
              window.dispatchEvent(new CustomEvent('onspace:prompt', { detail: chip.prompt }))
            }
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet/40 hover:shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet" />
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  )
}
