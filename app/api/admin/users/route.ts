import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { getCurrentUser, logAudit } from '@/lib/auth'
import { hasRole, hasPermission } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const canView = hasRole(user, 'admin', 'superadmin') || await hasPermission(user, 'admin.users.view')
  if (!canView) {
    return NextResponse.json({ error: 'صلاحية مرفوضة' }, { status: 403 })
  }

  await initDb()
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const status = searchParams.get('status')
  const role = searchParams.get('role')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const offset = (page - 1) * limit

  let sql = `SELECT u.id, u.name, u.username, u.email, u.role, u.status, u.plan_id,
             u.credits, u.created_at, u.updated_at, p.name AS plan_name
             FROM users u LEFT JOIN plans p ON p.id = u.plan_id WHERE 1=1`
  const params: unknown[] = []
  let paramIdx = 1

  if (search) {
    sql += ` AND (u.name ILIKE $${paramIdx} OR u.username ILIKE $${paramIdx} OR u.email ILIKE $${paramIdx})`
    params.push(`%${search}%`)
    paramIdx++
  }
  if (status) {
    sql += ` AND u.status = $${paramIdx}`
    params.push(status)
    paramIdx++
  }
  if (role) {
    sql += ` AND u.role = $${paramIdx}`
    params.push(role)
    paramIdx++
  }

  sql += ` ORDER BY u.created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`
  params.push(limit, offset)

  const { rows } = await query(sql, params)

  // Get total count
  let countSql = 'SELECT COUNT(*) as count FROM users u WHERE 1=1'
  const countParams: unknown[] = []
  let countIdx = 1
  if (search) {
    countSql += ` AND (u.name ILIKE $${countIdx} OR u.username ILIKE $${countIdx} OR u.email ILIKE $${countIdx})`
    countParams.push(`%${search}%`)
    countIdx++
  }
  if (status) {
    countSql += ` AND u.status = $${countIdx}`
    countParams.push(status)
    countIdx++
  }
  if (role) {
    countSql += ` AND u.role = $${countIdx}`
    countParams.push(role)
    countIdx++
  }
  const { rows: countRows } = await query(countSql, countParams)
  const total = parseInt(countRows[0].count)

  return NextResponse.json({ users: rows, total, page, limit })
}
