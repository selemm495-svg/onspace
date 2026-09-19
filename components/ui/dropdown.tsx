'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'

export function Dropdown({
  trigger,
  children,
  align = 'left',
}: {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div
          className={`absolute top-full z-50 mt-2 min-w-64 animate-pop-in rounded-2xl border border-border bg-popover shadow-xl ${
            align === 'left' ? 'left-0' : 'right-0'
          }`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}
