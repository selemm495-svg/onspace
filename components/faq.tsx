'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { FaqItem } from '@/lib/data'
import { cn } from '@/lib/utils'

export function FAQ({
  items,
  title = 'الأسئلة الشائعة',
  dark = false,
}: {
  items: FaqItem[]
  title?: string
  dark?: boolean
}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className={cn('py-20', dark ? 'bg-neutral-950 text-white' : '')}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className={cn('text-center text-3xl font-black md:text-4xl', dark ? 'text-white' : 'text-foreground')}>
          {title}
        </h2>
        <div className="mt-10 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={cn(
                  'overflow-hidden rounded-2xl border transition-colors',
                  dark ? 'border-white/10 bg-white/5' : 'border-border bg-card',
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
                >
                  <span className={cn('text-sm font-bold md:text-base', dark ? 'text-white' : 'text-foreground')}>
                    {item.q}
                  </span>
                  <Plus
                    className={cn(
                      'h-5 w-5 shrink-0 transition-transform duration-300',
                      isOpen && 'rotate-45',
                      dark ? 'text-white/70' : 'text-violet',
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className={cn('px-5 pb-5 text-sm leading-relaxed', dark ? 'text-white/70' : 'text-muted-foreground')}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
