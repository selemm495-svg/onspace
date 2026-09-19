'use client'

import { useState } from 'react'
import { Mail, Loader2, Check } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm font-bold text-foreground">اشترك في النشرة البريدية</p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="بريدك الإلكتروني"
          className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-violet/40"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex h-9 items-center justify-center rounded-full bg-violet px-4 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === 'success' ? (
            <Check className="h-4 w-4" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </button>
      </form>
      {status === 'success' && (
        <p className="mt-1.5 text-xs text-emerald-600">تم الاشتراك بنجاح! 🎉</p>
      )}
      {status === 'error' && (
        <p className="mt-1.5 text-xs text-destructive">حدث خطأ، حاول مرة أخرى</p>
      )}
    </div>
  )
}
