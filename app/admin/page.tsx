'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useAuth } from '@/components/auth-provider'
import { ALL_PERMISSIONS } from '@/lib/rbac'
import {
  Shield, Users, ScrollText, CreditCard, Search, Loader2,
  Ban, CheckCircle, Trash2, Edit, Eye, Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AdminUser = {
  id: string
  name: string
  username: string
  email: string
  role: string
  status: string
  plan_id: number
  credits: number
  created_at: string
  plan_name: string | null
}

type Tab = 'users' | 'plans' | 'audit'

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('users')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [total, setTotal] = useState(0)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [auditLogs, setAuditLogs] = useState<unknown[]>([])
  const [auditLoading, setAuditLoading] = useState(false)
  const [plans, setPlans] = useState<unknown[]>([])
  const [plansLoading, setPlansLoading] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else if (user.role !== 'admin' && user.role !== 'superadmin') {
        router.push('/')
      }
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      loadUsers()
    }
  }, [user, search, statusFilter])

  async function loadUsers() {
    setUsersLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    try {
      const res = await fetch(`/api/admin/users?${params}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
        setTotal(data.total)
      }
    } catch {
      // ignore
    } finally {
      setUsersLoading(false)
    }
  }

  async function loadAudit() {
    setAuditLoading(true)
    try {
      const res = await fetch('/api/admin/audit')
      if (res.ok) setAuditLogs(await res.json().then(d => d.logs))
    } catch {
      // ignore
    } finally {
      setAuditLoading(false)
    }
  }

  async function loadPlans() {
    setPlansLoading(true)
    try {
      const res = await fetch('/api/admin/plans')
      if (res.ok) setPlans(await res.json())
    } catch {
      // ignore
    } finally {
      setPlansLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'audit' && auditLogs.length === 0) loadAudit()
    if (activeTab === 'plans' && plans.length === 0) loadPlans()
  }, [activeTab])

  async function updateUserStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) loadUsers()
  }

  async function updateUserRole(id: string, role: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    if (res.ok) loadUsers()
  }

  async function updateCredits(id: string, credits: number) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credits }),
    })
    if (res.ok) loadUsers()
  }

  async function deleteUser(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) loadUsers()
  }

  if (authLoading || !user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-violet" />
        </div>
        <Footer />
      </main>
    )
  }

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'plans', label: 'الخطط', icon: CreditCard },
    { id: 'audit', label: 'سجل العمليات', icon: ScrollText },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-violet" />
          <h1 className="text-2xl font-black text-foreground">لوحة التحكم الإدارية</h1>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition-colors',
                activeTab === tab.id ? 'border-violet text-violet' : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="mt-6">
            {/* Filters */}
            <div className="mb-4 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث بالاسم أو البريد..."
                  className="input pr-10"
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
                <option value="">كل الحالات</option>
                <option value="active">نشط</option>
                <option value="suspended">موقوف</option>
              </select>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">{total} مستخدم</p>

            {usersLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-violet" /></div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">لا يوجد مستخدمون</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr className="text-right">
                      <th className="p-3 font-bold text-foreground">المستخدم</th>
                      <th className="p-3 font-bold text-foreground">الدور</th>
                      <th className="p-3 font-bold text-foreground">الحالة</th>
                      <th className="p-3 font-bold text-foreground">الخطة</th>
                      <th className="p-3 font-bold text-foreground">الرصيد</th>
                      <th className="p-3 font-bold text-foreground">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-border">
                        <td className="p-3">
                          <div className="font-bold text-foreground">{u.name}</div>
                          <div className="text-xs text-muted-foreground" dir="ltr">{u.email}</div>
                        </td>
                        <td className="p-3">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            className="rounded-lg border border-input bg-background px-2 py-1 text-xs"
                          >
                            <option value="user">مستخدم</option>
                            <option value="admin">مدير</option>
                            {user.role === 'superadmin' && <option value="superadmin">مدير عام</option>}
                          </select>
                        </td>
                        <td className="p-3">
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-bold',
                            u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
                          )}>
                            {u.status === 'active' ? 'نشط' : 'موقوف'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="flex items-center gap-1 text-xs">
                            {u.plan_id > 1 && <Crown className="h-3 w-3 text-amber-500" />}
                            {u.plan_name ?? 'مجاني'}
                          </span>
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            defaultValue={u.credits}
                            onBlur={(e) => {
                              const v = parseInt(e.target.value)
                              if (v !== u.credits) updateCredits(u.id, v)
                            }}
                            className="w-20 rounded-lg border border-input bg-background px-2 py-1 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {u.status === 'active' ? (
                              <button onClick={() => updateUserStatus(u.id, 'suspended')} title="تعليق"
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50">
                                <Ban className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <button onClick={() => updateUserStatus(u.id, 'active')} title="تفعيل"
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50">
                                <CheckCircle className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <a href={`/u/${u.username}`} title="عرض الملف"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
                              <Eye className="h-3.5 w-3.5" />
                            </a>
                            {user.role === 'superadmin' && u.id !== user.id && (
                              <button onClick={() => deleteUser(u.id)} title="حذف"
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 hover:bg-red-50">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Plans tab */}
        {activeTab === 'plans' && (
          <div className="mt-6">
            {plansLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-violet" /></div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {(plans as { id: number; name: string; price: string; period: string; description: string; features: string[]; credits: number; active: boolean }[]).map((plan) => (
                  <div key={plan.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-foreground">{plan.name}</h3>
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-bold',
                        plan.active ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground',
                      )}>
                        {plan.active ? 'مفعّل' : 'متوقف'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
                    <div className="mt-3 text-sm font-bold text-violet">{plan.credits.toLocaleString('ar-EG')} رصيد</div>
                    <ul className="mt-2 space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Audit tab */}
        {activeTab === 'audit' && (
          <div className="mt-6">
            {auditLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-violet" /></div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr className="text-right">
                      <th className="p-3 font-bold text-foreground">المستخدم</th>
                      <th className="p-3 font-bold text-foreground">العملية</th>
                      <th className="p-3 font-bold text-foreground">الهدف</th>
                      <th className="p-3 font-bold text-foreground">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(auditLogs as { id: number; actor_name: string; actor_username: string; action: string; target_type: string; target_id: string; created_at: string }[]).map((log) => (
                      <tr key={log.id} className="border-t border-border">
                        <td className="p-3">
                          <div className="font-bold text-foreground">{log.actor_name ?? 'النظام'}</div>
                          {log.actor_username && <div className="text-xs text-muted-foreground">@{log.actor_username}</div>}
                        </td>
                        <td className="p-3"><code className="text-xs text-violet" dir="ltr">{log.action}</code></td>
                        <td className="p-3 text-xs text-muted-foreground">{log.target_type ?? '—'}</td>
                        <td className="p-3 text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString('ar-EG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {auditLogs.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">لا توجد عمليات مسجلة</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
