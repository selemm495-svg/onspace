'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useAuth } from '@/components/auth-provider'
import { professionLabel } from '@/lib/professions'
import { getCountryByCode } from '@/lib/countries'
import {
  MapPin, Globe, Link2, Users, FolderGit, Eye,
  Calendar, UserPlus, UserMinus, Share2, Loader2,
  Briefcase, Award, Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ProfileData = {
  id: string
  name: string
  username: string
  bio: string | null
  profession: string | null
  specialty: string | null
  jobTitle: string | null
  country: string | null
  website: string | null
  socialLinks: Record<string, string>
  avatarUrl: string | null
  coverUrl: string | null
  userType: string | null
  createdAt: string
  planName: string | null
  email: string | null
  phone: string | null
  phoneCountryCode: string | null
  stats: { followers: number; following: number; projects: number; profileViews: number }
  isFollowing: boolean
  activity: { type: string; description: string; created_at: string }[]
  projects: { id: number; title: string; type: string; status: string; created_at: string }[]
}

type Tab = 'overview' | 'projects' | 'activity'

export default function ProfilePage() {
  const params = useParams<{ username: string }>()
  const username = params.username
  const { user: currentUser, refresh } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/users?username=${encodeURIComponent(username)}`)
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? 'فشل تحميل الملف')
          return
        }
        setProfile(data)
      } catch {
        setError('فشل تحميل الملف')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [username])

  async function handleFollow() {
    if (!currentUser || !profile) return
    setFollowLoading(true)
    const action = profile.isFollowing ? 'unfollow' : 'follow'
    try {
      const res = await fetch('/api/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profile.id, action }),
      })
      if (res.ok) {
        const data = await res.json()
        setProfile({
          ...profile,
          isFollowing: action === 'follow',
          stats: { ...profile.stats, followers: data.followersCount },
        })
      }
    } catch {
      // ignore
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
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

  if (error || !profile) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-lg font-bold text-muted-foreground">{error ?? 'المستخدم غير موجود'}</p>
        </div>
        <Footer />
      </main>
    )
  }

  const isOwner = currentUser?.id === profile.id
  const country = profile.country ? getCountryByCode(profile.country) : null

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Cover */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-violet/20 via-fuchsia-500/10 to-orange-400/10 sm:h-64">
        {profile.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.coverUrl} alt="غلاف" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Avatar + info */}
        <div className="-mt-16 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end">
          <div className="relative">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={profile.name} className="h-32 w-32 rounded-2xl border-4 border-background object-cover shadow-lg" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-violet via-fuchsia-500 to-orange-400 text-4xl font-black text-white shadow-lg">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground">{profile.name}</h1>
              {profile.planName && profile.planName !== 'مجاني' && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                  {profile.planName}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>

          <div className="flex items-center gap-2 pb-2">
            {isOwner ? (
              <a
                href="/settings"
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                تعديل الملف
              </a>
            ) : currentUser ? (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-transform hover:scale-105 active:scale-95 disabled:opacity-50',
                  profile.isFollowing
                    ? 'border border-border bg-background text-foreground'
                    : 'bg-foreground text-background',
                )}
              >
                {followLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {profile.isFollowing ? (
                  <><UserMinus className="h-4 w-4" /> إلغاء المتابعة</>
                ) : (
                  <><UserPlus className="h-4 w-4" /> متابعة</>
                )}
              </button>
            ) : null}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: profile.name, url: window.location.href })
                } else {
                  navigator.clipboard?.writeText(window.location.href)
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted"
              aria-label="مشاركة"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bio + meta */}
        <div className="mt-4 space-y-2">
          {profile.bio && <p className="text-foreground">{profile.bio}</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {profile.jobTitle && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" /> {profile.jobTitle}
              </span>
            )}
            {professionLabel(profile.profession) && (
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5" /> {professionLabel(profile.profession)}
              </span>
            )}
            {country && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {country.name}
              </span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-violet hover:underline">
                <Globe className="h-3.5 w-3.5" /> {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> انضم في {new Date(profile.createdAt).toLocaleDateString('ar-EG')}
            </span>
          </div>

          {/* Social links */}
          {Object.keys(profile.socialLinks).length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(profile.socialLinks).map(([key, url]) =>
                url ? (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-violet/10 hover:text-violet"
                  >
                    <Link2 className="h-3 w-3" /> {key}
                  </a>
                ) : null,
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          <StatCard icon={Users} label="متابعون" value={profile.stats.followers} />
          <StatCard icon={UserPlus} label="يتابع" value={profile.stats.following} />
          <StatCard icon={FolderGit} label="مشاريع" value={profile.stats.projects} />
          <StatCard icon={Eye} label="مشاهدات" value={profile.stats.profileViews} />
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-border">
          <div className="flex gap-1">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
              نظرة عامة
            </TabButton>
            {profile.projects && profile.projects.length > 0 && (
              <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')}>
                المشاريع ({profile.projects.length})
              </TabButton>
            )}
            {profile.activity && profile.activity.length > 0 && (
              <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
                النشاط
              </TabButton>
            )}
          </div>
        </div>

        {/* Tab content */}
        <div className="py-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {profile.bio && (
                <Section title="نبذة">
                  <p className="text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
                </Section>
              )}
              {(profile.specialty || profile.jobTitle || professionLabel(profile.profession)) && (
                <Section title="معلومات مهنية">
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {professionLabel(profile.profession) && <InfoRow label="المجال" value={professionLabel(profile.profession)!} />}
                    {profile.specialty && <InfoRow label="التخصص" value={profile.specialty} />}
                    {profile.jobTitle && <InfoRow label="المسمى الوظيفي" value={profile.jobTitle} />}
                  </dl>
                </Section>
              )}
              {profile.projects && profile.projects.length > 0 && (
                <Section title="أحدث المشاريع">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {profile.projects.slice(0, 4).map((p) => (
                      <div key={p.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-foreground">{p.title}</h4>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{p.type}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString('ar-EG')}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}

          {activeTab === 'projects' && profile.projects && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {profile.projects.map((p) => (
                <div key={p.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground">{p.title}</h4>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{p.type}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString('ar-EG')}</span>
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      p.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
                    )}>
                      {p.status === 'ready' ? 'جاهز' : 'قيد العمل'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && profile.activity && (
            <div className="space-y-3">
              {profile.activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet/10">
                    <Activity className="h-4 w-4 text-violet" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString('ar-EG')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-16" />
      <Footer />
    </main>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
      <div className="mt-1 text-lg font-black text-foreground">{value.toLocaleString('ar-EG')}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'border-b-2 px-4 py-2.5 text-sm font-bold transition-colors',
        active ? 'border-violet text-violet' : 'border-transparent text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-foreground">{title}</h3>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}
