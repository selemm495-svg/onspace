import { cookies } from 'next/headers'
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { query, initDb } from '@/lib/db'

export const SESSION_COOKIE = 'onspace_session'
const SESSION_DURATION_DAYS = 30

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const testHash = scryptSync(password, salt, 64)
  return timingSafeEqual(Buffer.from(hash, 'hex'), testHash)
}

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export type SafeUser = {
  id: string
  email: string
  name: string
  username: string
  role: string
  status: string
  phone: string | null
  phoneCountryCode: string | null
  country: string | null
  timezone: string
  language: string
  userType: string | null
  profession: string | null
  specialty: string | null
  jobTitle: string | null
  bio: string | null
  website: string | null
  socialLinks: Record<string, string>
  avatarUrl: string | null
  coverUrl: string | null
  credits: number
  planId: number
  planName: string | null
  subscriptionStatus: string
  subscriptionExpiresAt: string | null
  createdAt: string
}

function mapUser(row: Record<string, unknown>): SafeUser {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string,
    username: row.username as string,
    role: row.role as string,
    status: row.status as string,
    phone: (row.phone as string) ?? null,
    phoneCountryCode: (row.phone_country_code as string) ?? null,
    country: (row.country as string) ?? null,
    timezone: (row.timezone as string) ?? 'Africa/Cairo',
    language: (row.language as string) ?? 'ar',
    userType: (row.user_type as string) ?? null,
    profession: (row.profession as string) ?? null,
    specialty: (row.specialty as string) ?? null,
    jobTitle: (row.job_title as string) ?? null,
    bio: (row.bio as string) ?? null,
    website: (row.website as string) ?? null,
    socialLinks: (row.social_links as Record<string, string>) ?? {},
    avatarUrl: (row.avatar_url as string) ?? null,
    coverUrl: (row.cover_url as string) ?? null,
    credits: (row.credits as number) ?? 0,
    planId: (row.plan_id as number) ?? 1,
    planName: (row.plan_name as string) ?? null,
    subscriptionStatus: (row.subscription_status as string) ?? 'active',
    subscriptionExpiresAt: (row.subscription_expires_at as string) ?? null,
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
  }
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  await initDb()
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const { rows } = await query(
      `SELECT u.*, p.name AS plan_name
       FROM users u
       JOIN user_sessions s ON s.user_id = u.id
       LEFT JOIN plans p ON p.id = u.plan_id
       WHERE s.token = $1 AND s.expires_at > NOW() AND u.status = 'active'`,
      [token],
    )
    if (rows.length === 0) return null
    return mapUser(rows[0])
  } catch {
    return null
  }
}

export async function createSession(userId: string, ip?: string, userAgent?: string): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)
  await query(
    'INSERT INTO user_sessions (user_id, token, expires_at, ip, user_agent) VALUES ($1, $2, $3, $4, $5)',
    [userId, token, expiresAt, ip ?? null, userAgent ?? null],
  )
  return token
}

export async function destroySession(token: string): Promise<void> {
  await query('DELETE FROM user_sessions WHERE token = $1', [token])
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

// Reserved usernames that cannot be claimed
export const RESERVED_USERNAMES = new Set([
  'admin', 'api', 'auth', 'login', 'register', 'settings', 'profile', 'u',
  'dashboard', 'admin', 'blog', 'changelog', 'pricing', 'projects', 'community',
  'about', 'help', 'support', 'terms', 'privacy', 'search', 'explore',
  'agentic-app-builder', 'ai-website-builder', 'ios-app-builder', 'www',
  'mail', 'ftp', 'root', 'superuser', 'system', 'config', 'static', 'assets',
  'public', 'private', 'new', 'edit', 'delete', 'create', 'update', 'notifications',
])

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.length < 3) return { valid: false, error: 'الاسم يجب أن يكون 3 أحرف على الأقل' }
  if (username.length > 30) return { valid: false, error: 'الاسم يجب ألا يتجاوز 30 حرفًا' }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return { valid: false, error: 'يُسمح فقط بحروف إنجليزية وأرقام و _ و -' }
  if (RESERVED_USERNAMES.has(username.toLowerCase())) return { valid: false, error: 'هذا الاسم محجوز' }
  return { valid: true }
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function logActivity(userId: string, type: string, description: string, metadata?: Record<string, unknown>, visibility = 'public') {
  await query(
    'INSERT INTO user_activity (user_id, type, description, metadata, visibility) VALUES ($1, $2, $3, $4, $5)',
    [userId, type, description, JSON.stringify(metadata ?? {}), visibility],
  )
}

export async function logAudit(actorId: string | null, action: string, target_type?: string, target_id?: string, details?: Record<string, unknown>, ip?: string) {
  await query(
    'INSERT INTO audit_logs (actor_id, action, target_type, target_id, details, ip) VALUES ($1, $2, $3, $4, $5, $6)',
    [actorId, action, target_type ?? null, target_id ?? null, JSON.stringify(details ?? {}), ip ?? null],
  )
}
