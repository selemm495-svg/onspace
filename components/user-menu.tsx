'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth-provider'
import { Dropdown } from '@/components/ui/dropdown'
import { usePathname } from 'next/navigation'
import {
  Settings, User, LogOut, Shield, Sparkles, CreditCard,
  ChevronDown, Crown,
} from 'lucide-react'

export function UserMenu() {
  const { user, loading, logout } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground sm:block"
        >
          تسجيل الدخول
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95"
        >
          ابدأ مجانًا
        </Link>
      </div>
    )
  }

  const isAdmin = user.role === 'admin' || user.role === 'superadmin'
  const isPaid = user.planId > 1

  return (
    <Dropdown
      align="right"
      trigger={
        <button className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted" aria-label="قائمة المستخدم">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet via-fuchsia-500 to-orange-400 text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      }
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet via-fuchsia-500 to-orange-400 text-lg font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <div className="truncate font-bold text-foreground">{user.name}</div>
            <div className="truncate text-sm text-muted-foreground">@{user.username}</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            isPaid ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'
          }`}>
            {isPaid ? <Crown className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
            {user.planName ?? 'مجاني'}
          </span>
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {user.status === 'active' ? 'نشط' : 'موقوف'}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-muted px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">الرصيد المتاح</span>
          <span className="flex items-center gap-1 text-sm font-bold text-foreground">
            <CreditCard className="h-3.5 w-3.5 text-violet" />
            {user.credits.toLocaleString('ar-EG')}
          </span>
        </div>
      </div>

      <div className="border-t border-border">
        <Link href={`/u/${user.username}`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
          الملف الشخصي
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <Settings className="h-4 w-4 text-muted-foreground" />
          إعدادات الحساب
        </Link>
        <Link href="/settings?tab=billing" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          الاشتراك والفوترة
        </Link>
        {isAdmin && (
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <Shield className="h-4 w-4 text-violet" />
            لوحة التحكم الإدارية
          </Link>
        )}
        <button
          onClick={() => { logout() }}
          className="flex w-full items-center gap-3 border-t border-border px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </Dropdown>
  )
}
