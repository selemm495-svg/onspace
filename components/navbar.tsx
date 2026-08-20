'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Sparkles,
  Smartphone,
  Globe,
  Tag,
  Gift,
  Plus,
  Menu,
  X,
} from 'lucide-react'
import { navItems } from '@/lib/data'
import { cn } from '@/lib/utils'

const iconMap = {
  agentic: Sparkles,
  mobile: Smartphone,
  website: Globe,
  pricing: Tag,
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5" aria-label="OnSpace الصفحة الرئيسية">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet to-violet-soft text-[11px] font-black text-white">
        O
      </span>
      <span className="text-lg font-black tracking-tight text-foreground">
        ON<span className="text-violet">SPACE</span>
      </span>
    </Link>
  )
}

export function Navbar({ credits = 1500 }: { credits?: number }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
        </div>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon]
            const active = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'text-violet'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center rounded-full border border-violet/30 bg-gradient-to-l from-violet/10 to-fuchsia-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-violet sm:flex">
            بريميوم خصم ٢٥٪
          </span>
          <button
            aria-label="الهدايا"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted sm:flex"
          >
            <Gift className="h-4.5 w-4.5" />
          </button>
          <div className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1.5">
            <span className="h-4 w-4 rounded-full bg-gradient-to-br from-violet to-fuchsia-400" />
            <span className="text-sm font-bold text-foreground">{credits.toLocaleString('ar-EG')}</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet text-white">
              <Plus className="h-3 w-3" />
            </span>
          </div>
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-violet via-fuchsia-500 to-orange-400 ring-2 ring-background" aria-label="حساب المستخدم" />

          <button
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon]
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      active ? 'bg-violet/10 text-violet' : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </header>
  )
}
