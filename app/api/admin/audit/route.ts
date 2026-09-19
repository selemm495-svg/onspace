import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { hasRole, hasPermission } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const canView = hasRole(user, 'admin', 'superadmin') || await hasPermission(user, 'admin.audit.view')
  if (!canView) return NextResponse.json({ error: 'صلاحية مرفوضة' }, { status: 403 })

  await initDb()
  const { searchParams } = new URL(request.url)
  const actorId = searchParams.get('actorId')
  const action = searchParams.get('action')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 50
  const offset = (page - 1) * limit

  let sql = `SELECT a.*, u.name AS actor_name, u.username AS actor_username
             FROM audit_logs a LEFT JOIN users u ON u.id = a.actor_id WHERE 1=1`
  const params: unknown[] = []
  let idx = 1

  if (actorId) {
    sql += ` AND a.actor_id = $${idx}`
    params.push(actorId)
    idx++
  }
  if (action) {
    sql += ` AND a.action ILIKE $${idx}`
    params.push(`%${action}%`)
    idx++
  }

  sql += ` ORDER BY a.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`
  params.push(limit, offset)

  const { rows } = await query(sql, params)
  return NextResponse.json({ logs: rows, page, limit })
}
