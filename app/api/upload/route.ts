import { NextRequest, NextResponse } from 'next/server'
import { query, initDb } from '@/lib/db'
import { getCurrentUser, logActivity } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
  await initDb()

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null // 'avatar' | 'cover'

    if (!file || !type) {
      return NextResponse.json({ error: 'الملف والنوع مطلوبان' }, { status: 400 })
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      return NextResponse.json({ error: 'صيغة الصورة غير مدعومة' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${randomUUID()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const filepath = join(uploadDir, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`
    const column = type === 'cover' ? 'cover_url' : 'avatar_url'
    await query(`UPDATE users SET ${column} = $1, updated_at = NOW() WHERE id = $2`, [url, user.id])

    await logActivity(user.id, type === 'cover' ? 'cover_updated' : 'avatar_updated', 'تم تحديث الصورة')

    return NextResponse.json({ url })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'فشل رفع الصورة' }, { status: 500 })
  }
}
