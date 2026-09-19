'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useAuth } from '@/components/auth-provider'
import { countries } from '@/lib/countries'
import { timezones } from '@/lib/timezones'
import { professions } from '@/lib/professions'
import {
  User, Image, Shield, CreditCard, Save, Loader2, Upload, Check,
  Globe, Phone, MapPin, Clock, Briefcase,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'account' | 'profile' | 'avatar' | 'privacy' | 'billing'

const privacyLevels = [
  { value: 'public', label: 'عام' },
  { value: 'registered', label: 'المستخدمون المسجلون' },
  { value: 'team', label: 'أعضاء الفريق' },
  { value: 'private', label: 'خاص' },
]

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading, refresh } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('account')

  // Read tab from URL query on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab') as Tab
      if (tab && ['account', 'profile', 'avatar', 'privacy', 'billing'].includes(tab)) {
        setActiveTab(tab)
      }
    }
  }, [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Profile form
  const [form, setForm] = useState({
    name: '', username: '', bio: '', profession: '', specialty: '',
    jobTitle: '', country: '', phoneCountryCode: '', phone: '',
    timezone: 'Africa/Cairo', language: 'ar', userType: '', website: '',
    socialLinks: { twitter: '', github: '', linkedin: '', instagram: '' },
  })

  // Privacy form
  const [privacy, setPrivacy] = useState({
    emailVisibility: 'private', phoneVisibility: 'private',
    countryVisibility: 'public', projectsVisibility: 'public',
    postsVisibility: 'public', imagesVisibility: 'public',
    appsVisibility: 'public', activityVisibility: 'public',
    worksVisibility: 'public', profileVisibility: 'public',
  })

  // Avatar upload
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        username: user.username,
        bio: user.bio ?? '',
        profession: user.profession ?? '',
        specialty: user.specialty ?? '',
        jobTitle: user.jobTitle ?? '',
        country: user.country ?? '',
        phoneCountryCode: user.phoneCountryCode ?? '',
        phone: user.phone ?? '',
        timezone: user.timezone,
        language: user.language,
        userType: user.userType ?? '',
        website: user.website ?? '',
        socialLinks: {
          twitter: user.socialLinks?.twitter ?? '',
          github: user.socialLinks?.github ?? '',
          linkedin: user.socialLinks?.linkedin ?? '',
          instagram: user.socialLinks?.instagram ?? '',
        },
      })
    }
  }, [user])

  // Fetch privacy settings
  useEffect(() => {
    if (user) {
      fetch('/api/profile').then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          if (data.privacy) {
            setPrivacy({
              emailVisibility: data.privacy.email_visibility ?? 'private',
              phoneVisibility: data.privacy.phone_visibility ?? 'private',
              countryVisibility: data.privacy.country_visibility ?? 'public',
              projectsVisibility: data.privacy.projects_visibility ?? 'public',
              postsVisibility: data.privacy.posts_visibility ?? 'public',
              imagesVisibility: data.privacy.images_visibility ?? 'public',
              appsVisibility: data.privacy.apps_visibility ?? 'public',
              activityVisibility: data.privacy.activity_visibility ?? 'public',
              worksVisibility: data.privacy.works_visibility ?? 'public',
              profileVisibility: data.privacy.profile_visibility ?? 'public',
            })
          }
        }
      })
    }
  }, [user])

  async function saveProfile() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'فشل الحفظ')
      } else {
        setSaved(true)
        await refresh()
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError('فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  async function savePrivacy() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacy),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError('فشل حفظ الخصوصية')
      }
    } catch {
      setError('فشل حفظ الخصوصية')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpload(file: File, type: 'avatar' | 'cover') {
    setUploading(true)
    setUploadError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error ?? 'فشل رفع الصورة')
      } else {
        await refresh()
      }
    } catch {
      setUploadError('فشل رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  if (authLoading || !user) {
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
    { id: 'account', label: 'الحساب', icon: User },
    { id: 'profile', label: 'الملف الشخصي', icon: Briefcase },
    { id: 'avatar', label: 'الصور', icon: Image },
    { id: 'privacy', label: 'الخصوصية', icon: Shield },
    { id: 'billing', label: 'الاشتراك', icon: CreditCard },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-black text-foreground">إعدادات الحساب</h1>

        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Sidebar */}
          <div className="sm:w-48">
            <div className="flex gap-1 overflow-x-auto sm:flex-col">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors',
                    activeTab === tab.id ? 'bg-violet/10 text-violet' : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
            {saved && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <Check className="h-4 w-4" /> تم الحفظ بنجاح
              </div>
            )}

            {/* Account tab */}
            {activeTab === 'account' && (
              <div className="space-y-4">
                <Card title="البيانات الأساسية">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="الاسم">
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input" />
                    </Field>
                    <Field label="اسم المستخدم">
                      <div className="relative">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                        <input value={form.username} dir="ltr"
                          onChange={(e) => setForm({ ...form, username: e.target.value.replace(/\s/g, '') })}
                          className="input pr-7" />
                      </div>
                    </Field>
                    <Field label="البريد الإلكتروني">
                      <input value={user.email} disabled dir="ltr" className="input opacity-60" />
                    </Field>
                    <Field label="رقم الهاتف">
                      <div className="flex gap-2">
                        <select
                          value={form.phoneCountryCode}
                          onChange={(e) => setForm({ ...form, phoneCountryCode: e.target.value })}
                          className="input w-32 shrink-0"
                        >
                          <option value="">الكود</option>
                          {countries.map((c) => (
                            <option key={c.code} value={c.dialCode}>
                              {c.dialCode} {c.name}
                            </option>
                          ))}
                        </select>
                        <input value={form.phone} dir="ltr" placeholder="123456789"
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="input flex-1" />
                      </div>
                    </Field>
                    <Field label="الدولة">
                      <select value={form.country}
                        onChange={(e) => {
                          const c = countries.find((c) => c.name === e.target.value)
                          setForm({ ...form, country: c?.code ?? '', phoneCountryCode: c?.dialCode ?? form.phoneCountryCode })
                        }}
                        className="input">
                        <option value="">اختر الدولة</option>
                        {countries.map((c) => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="المنطقة الزمنية">
                      <select value={form.timezone}
                        onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                        className="input">
                        {timezones.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="اللغة">
                      <select value={form.language}
                        onChange={(e) => setForm({ ...form, language: e.target.value })}
                        className="input">
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </Field>
                  </div>
                </Card>
                <SaveButton onSave={saveProfile} saving={saving} />
              </div>
            )}

            {/* Profile tab */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <Card title="المعلومات المهنية">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="نوع المستخدم / المجال">
                      <select value={form.userType}
                        onChange={(e) => setForm({ ...form, userType: e.target.value })}
                        className="input">
                        <option value="">اختر المجال</option>
                        {professions.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="التخصص">
                      <input value={form.specialty}
                        onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                        className="input" placeholder="مثال: تطوير الواجهات" />
                    </Field>
                    <Field label="المسمى الوظيفي">
                      <input value={form.jobTitle}
                        onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                        className="input" placeholder="مثال: مهندس برمجيات" />
                    </Field>
                    <Field label="الموقع الإلكتروني">
                      <input value={form.website} dir="ltr"
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="input" placeholder="https://example.com" />
                    </Field>
                  </div>
                </Card>
                <Card title="النبذة التعريفية">
                  <textarea value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={4} maxLength={500}
                    className="input resize-none"
                    placeholder="اكتب نبذة تعريفية عنك..." />
                  <p className="mt-1 text-left text-xs text-muted-foreground">{form.bio.length}/500</p>
                </Card>
                <Card title="الروابط الخارجية">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="تويتر / X">
                      <input value={form.socialLinks.twitter} dir="ltr"
                        onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })}
                        className="input" placeholder="https://x.com/username" />
                    </Field>
                    <Field label="GitHub">
                      <input value={form.socialLinks.github} dir="ltr"
                        onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })}
                        className="input" placeholder="https://github.com/username" />
                    </Field>
                    <Field label="LinkedIn">
                      <input value={form.socialLinks.linkedin} dir="ltr"
                        onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })}
                        className="input" placeholder="https://linkedin.com/in/username" />
                    </Field>
                    <Field label="Instagram">
                      <input value={form.socialLinks.instagram} dir="ltr"
                        onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })}
                        className="input" placeholder="https://instagram.com/username" />
                    </Field>
                  </div>
                </Card>
                <SaveButton onSave={saveProfile} saving={saving} />
              </div>
            )}

            {/* Avatar tab */}
            {activeTab === 'avatar' && (
              <div className="space-y-4">
                {uploadError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {uploadError}
                  </div>
                )}
                <Card title="الصورة الشخصية">
                  <div className="flex items-center gap-4">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt={user.name} className="h-24 w-24 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-violet via-fuchsia-500 to-orange-400 text-2xl font-black text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95">
                          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          {uploading ? 'جاري الرفع...' : 'رفع صورة جديدة'}
                        </span>
                        <input type="file" accept="image/*" className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'avatar') }} />
                      </label>
                      <p className="mt-2 text-xs text-muted-foreground">JPG, PNG, WebP — حتى 5 ميجابايت</p>
                    </div>
                  </div>
                </Card>
                <Card title="صورة الغلاف">
                  <div className="relative h-32 overflow-hidden rounded-xl bg-gradient-to-br from-violet/20 via-fuchsia-500/10 to-orange-400/10">
                    {user.coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.coverUrl} alt="غلاف" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <label className="mt-3 inline-block cursor-pointer">
                    <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading ? 'جاري الرفع...' : 'رفع غلاف جديد'}
                    </span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'cover') }} />
                  </label>
                </Card>
              </div>
            )}

            {/* Privacy tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <Card title="مستوى خصوصية الملف الشخصي">
                  <PrivacySelect
                    label="ظهور الملف الشخصي"
                    value={privacy.profileVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, profileVisibility: v })}
                  />
                </Card>
                <Card title="البيانات الشخصية">
                  <PrivacySelect label="البريد الإلكتروني" value={privacy.emailVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, emailVisibility: v })} />
                  <PrivacySelect label="رقم الهاتف" value={privacy.phoneVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, phoneVisibility: v })} />
                  <PrivacySelect label="الدولة" value={privacy.countryVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, countryVisibility: v })} />
                </Card>
                <Card title="المحتوى">
                  <PrivacySelect label="المشاريع" value={privacy.projectsVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, projectsVisibility: v })} />
                  <PrivacySelect label="المنشورات" value={privacy.postsVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, postsVisibility: v })} />
                  <PrivacySelect label="الصور" value={privacy.imagesVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, imagesVisibility: v })} />
                  <PrivacySelect label="التطبيقات" value={privacy.appsVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, appsVisibility: v })} />
                </Card>
                <Card title="النشاط والأعمال">
                  <PrivacySelect label="النشاط" value={privacy.activityVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, activityVisibility: v })} />
                  <PrivacySelect label="الأعمال" value={privacy.worksVisibility}
                    onChange={(v) => setPrivacy({ ...privacy, worksVisibility: v })} />
                </Card>
                <SaveButton onSave={savePrivacy} saving={saving} />
              </div>
            )}

            {/* Billing tab */}
            {activeTab === 'billing' && (
              <div className="space-y-4">
                <Card title="الخطة الحالية">
                  <div className="flex items-center justify-between rounded-xl bg-muted p-4">
                    <div>
                      <div className="text-lg font-black text-foreground">{user.planName ?? 'مجاني'}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.subscriptionStatus === 'active' ? 'اشتراك نشط' : 'غير نشط'}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black text-violet">{user.credits.toLocaleString('ar-EG')}</div>
                      <div className="text-xs text-muted-foreground">رصيد متاح</div>
                    </div>
                  </div>
                </Card>
                <PlansList currentPlanId={user.planId} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-16" />
      <Footer />
    </main>
  )
}

function PlansList({ currentPlanId }: { currentPlanId: number }) {
  const [plans, setPlans] = useState<{ id: number; name: string; price: string; period: string; description: string; features: string[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/plans').then(async (res) => {
      if (res.ok) setPlans(await res.json())
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="py-8 text-center text-sm text-muted-foreground">جاري التحميل...</div>

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.id} className={cn(
          'rounded-xl border-2 p-4',
          plan.id === currentPlanId ? 'border-violet bg-violet/5' : 'border-border bg-card',
        )}>
          <div className="flex items-center justify-between">
            <h4 className="font-black text-foreground">{plan.name}</h4>
            {plan.id === currentPlanId && (
              <span className="rounded-full bg-violet px-2 py-0.5 text-xs font-bold text-white">الحالية</span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-foreground">{plan.price}</span>
            <span className="text-sm text-muted-foreground">{plan.period}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
          <ul className="mt-3 space-y-1">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="h-3 w-3 text-emerald-500" /> {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-bold text-foreground">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function PrivacySelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input w-40">
        {privacyLevels.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
    </div>
  )
}

function SaveButton({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
    >
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
    </button>
  )
}
