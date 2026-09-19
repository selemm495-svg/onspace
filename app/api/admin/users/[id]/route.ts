import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { getCurrentUser, logAudit } from '@/lib/auth'
import { hasRole, hasPermission, getUserPermissions, grantPermission, revokePermission } from '@/lib/rbac'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const canView = hasRole(user, 'admin', 'superadmin') || await hasPermission(user, 'admin.users.view')
  if (!canView) return NextResponse.json({ error: 'صلاحية مرفوضة' }, { status: 403 })

  await initDb()
  const { id } = await params()

  const { rows } = await query(
    `SELECT u.*, p.name AS plan_name
     FROM users u LEFT JOIN plans p ON p.id = u.plan_id
     WHERE u.id = $1`,
    [id],
  )
  if (rows.length === 0) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

  const target = rows[0]
  delete target.password_hash

  // Technical info (admin only)
  const canTechnical = hasRole(user, 'admin', 'superadmin') || await hasPermission(user, 'admin.technical.view')
  let technical: Record<string, unknown> | null = null
  if (canTechnical) {
    const { rows: sessionRows } = await query(
      'SELECT ip, user_agent, created_at, expires_at FROM user_sessions WHERE user_id = $1 AND expires_at > NOW() ORDER BY created_at DESC',
      [id],
    )
    const { rows: lastActivity } = await query(
      'SELECT created_at FROM user_activity WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [id],
    )
    technical = {
      sessions: sessionRows,
      lastActivity: lastActivity[0]?.created_at ?? null,
      activeSessions: sessionRows.length,
    }
  }

  const permissions = await getUserPermissions(id)
  const { rows: privacyRows } = await query('SELECT * FROM user_privacy WHERE user_id = $1', [id])

  const { rows: followerCount } = await query('SELECT COUNT(*) as count FROM follows WHERE followee_id = $1', [id])
  const { rows: followingCount } = await query('SELECT COUNT(*) as count FROM follows WHERE follower_id = $1', [id])
  const { rows: projectCount } = await query('SELECT COUNT(*) as count FROM projects WHERE user_id = $1', [id])

  return NextResponse.json({
    user: target,
    privacy: privacyRows[0] ?? {},
    permissions,
    technical,
    stats: {
      followers: parseInt(followerCount[0].count),
      following: parseInt(followingCount[0].count),
      projects: parseInt(projectCount[0].count),
    },
  })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const canEdit = hasRole(user, 'admin', 'superadmin') || await hasPermission(user, 'admin.users.edit')
  if (!canEdit) return NextResponse.json({ error: 'صلاحية مرفوضة' }, { status: 403 })

  await initDb()
  const { id } = await params()
  const body = await request.json()
  const ip = request.headers.get('x-forwarded-for') ?? undefined

  const allowedFields = ['name', 'username', 'email', 'role', 'status', 'credits', 'plan_id', 'subscription_status']
  const updates: string[] = []
  const values: unknown[] = []
  let idx = 1

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = $${idx}`)
      values.push(body[field])
      idx++
    }
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'لا توجد تحديثات' }, { status: 400 })
  }

  updates.push('updated_at = NOW()')
  values.push(id)

  await query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx}`,
    values,
  )

  // Handle permission grants/revokes
  if (body.grantPermissions) {
    for (const perm of body.grantPermissions) {
      await grantPermission(id, perm, body.permissionExpiresAt ? new Date(body.permissionExpiresAt) : undefined)
    }
  }
  if (body.revokePermissions) {
    for (const perm of body.revokePermissions) {
      await revokePermission(id, perm)
    }
  }

  await logAudit(user.id, 'admin.user.update', 'user', id, body, ip)
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const canDelete = hasRole(user, 'superadmin') || await hasPermission(user, 'admin.users.delete')
  if (!canDelete) return NextResponse.json({ error: 'صلاحية مرفوضة' }, { status: 403 })

  await initDb()
  const { id } = await params()
  const ip = request.headers.get('x-forwarded-for') ?? undefined

  if (id === user.id) {
    return NextResponse.json({ error: 'لا يمكنك حذف حسابك' }, { status: 400 })
  }

  await query('DELETE FROM users WHERE id = $1', [id])
  await logAudit(user.id, 'admin.user.delete', 'user', id, {}, ip)
  return NextResponse.json({ ok: true })
}
