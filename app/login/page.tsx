'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useAuth } from '@/components/auth-provider'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { refresh } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'فشل تسجيل الدخول')
        setLoading(false)
        return
      }
      await refresh()
      router.push('/')
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
          <h1 className="text-center text-3xl font-black text-foreground">تسجيل الدخول</h1>
          <p className="mt-2 text-center text-muted-foreground">أهلاً بعودتك إلى OnSpace</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="font-bold text-violet hover:underline">
              أنشئ حسابًا مجانًا
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
