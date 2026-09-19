import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { getCurrentUser, logActivity } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
  await initDb()

  try {
    const body = await request.json()
    const { targetUserId, action } = body // action: 'follow' | 'unfollow'

    if (!targetUserId || user.id === targetUserId) {
      return NextResponse.json({ error: 'مستخدم غير صالح' }, { status: 400 })
    }

    const { rows: targetRows } = await query('SELECT id, name, username FROM users WHERE id = $1 AND status = $2', [targetUserId, 'active'])
    if (targetRows.length === 0) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    const target = targetRows[0]

    if (action === 'follow') {
      await query(
        'INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [user.id, targetUserId],
      )
      await logActivity(user.id, 'followed_user', `بدأت متابعة ${target.name}`, { targetUserId }, 'public')
    } else {
      await query(
        'DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2',
        [user.id, targetUserId],
      )
      await logActivity(user.id, 'unfollowed_user', `أوقفت متابعة ${target.name}`, { targetUserId }, 'private')
    }

    const { rows } = await query('SELECT COUNT(*) as count FROM follows WHERE followee_id = $1', [targetUserId])
    return NextResponse.json({
      ok: true,
      action,
      followersCount: parseInt(rows[0].count),
    })
  } catch (e) {
    console.error('Follow error:', e)
    return NextResponse.json({ error: 'فشلت العملية' }, { status: 500 })
  }
}
