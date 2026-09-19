'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useAuth } from '@/components/auth-provider'
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check, X } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { refresh } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  useEffect(() => {
    if (!form.username || form.username.length < 3) {
      setUsernameStatus('idle')
      return
    }
    setUsernameStatus('checking')
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(form.username)}`)
        const data = await res.json()
        setUsernameStatus(data.available ? 'available' : 'taken')
      } catch {
        setUsernameStatus('idle')
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [form.username])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'فشل إنشاء الحساب')
        setLoading(false)
        return
      }
      await refresh()
      router.push('/settings')
      router.refresh()
    } catch {
      setError('حدث خطأ غير متوقع')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
        <div className="w-full">
          <h1 className="text-center text-3xl font-black text-foreground">إنشاء حساب</h1>
          <p className="mt-2 text-center text-muted-foreground">ابدأ رحلتك مع OnSpace مجانًا</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">الاسم</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="اسمك الكامل"
                  className="w-full rounded-xl border border-input bg-background py-2.5 pr-10 pl-4 text-sm text-foreground outline-none transition-colors focus:border-violet focus:ring-2 focus:ring-violet/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">اسم المستخدم</label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value.replace(/\s/g, '') })}
                  required
                  dir="ltr"
                  placeholder="username"
                  className="w-full rounded-xl border border-input bg-background py-2.5 pr-8 pl-10 text-sm text-foreground outline-none transition-colors focus:border-violet focus:ring-2 focus:ring-violet/20"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  {usernameStatus === 'available' && <Check className="h-4 w-4 text-emerald-500" />}
                  {usernameStatus === 'taken' && <X className="h-4 w-4 text-red-500" />}
                </div>
              </div>
              {usernameStatus === 'available' && (
                <p className="mt-1 text-xs text-emerald-600">الاسم متاح ✓</p>
              )}
              {usernameStatus === 'taken' && (
                <p className="mt-1 text-xs text-red-600">الاسم محجوز</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  dir="ltr"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-input bg-background py-2.5 pr-10 pl-4 text-sm text-foreground outline-none transition-colors focus:border-violet focus:ring-2 focus:ring-violet/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  dir="ltr"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-background py-2.5 pr-10 pl-10 text-sm text-foreground outline-none transition-colors focus:border-violet focus:ring-2 focus:ring-violet/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">6 أحرف على الأقل</p>
            </div>
            <button
              type="submit"
              disabled={loading || usernameStatus === 'taken'}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="font-bold text-violet hover:underline">
              سجل الدخول
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
