import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, destroySession, getSessionToken, clearSessionCookie, logAudit } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  const token = await getSessionToken()
  if (token) {
    await destroySession(token)
    if (user) {
      const ip = request.headers.get('x-forwarded-for') ?? undefined
      await logAudit(user.id, 'user.logout', 'user', user.id, {}, ip ?? undefined)
    }
  }
  await clearSessionCookie()
  return NextResponse.json({ ok: true })
}
