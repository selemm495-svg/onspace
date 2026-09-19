import { query, initDb } from '@/lib/db'
import { Plus } from 'lucide-react'

type Project = {
  id: number
  title: string
  prompt: string
  status: string
  platform: string
  visibility: string
}

export async function ProjectsSection({ type }: { type: string }) {
  await initDb()
  let projects: Project[] = []
  try {
    const { rows } = await query(
      'SELECT * FROM projects WHERE type = $1 ORDER BY created_at DESC LIMIT 8',
      [type],
    )
    projects = rows
  } catch {
    // DB not ready — render empty state
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-full bg-gradient-to-br from-violet via-fuchsia-500 to-orange-400" />
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">مشاريعي</p>
          <p className="text-xs text-muted-foreground">
            {projects.length === 0 ? 'لا يوجد مشاريع بعد — ابدأ بإنشاء أول مشروع!' : `${projects.length} مشروع`}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-violet/10 px-2 py-0.5 text-[10px] font-bold text-violet">
                {p.status === 'ready' ? 'جاهز' : 'قيد البناء'}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {p.visibility === 'public' ? 'عام' : 'خاص'}
              </span>
            </div>
            <p className="mb-3 line-clamp-2 text-right text-sm font-bold text-foreground">{p.title}</p>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-gradient-to-br from-violet/10 to-fuchsia-200/40" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 rounded-lg bg-muted/40" />
                <div className="h-10 rounded-lg bg-muted/40" />
              </div>
            </div>
          </div>
        ))}

        <button className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm font-semibold text-muted-foreground transition-colors hover:border-violet/40 hover:text-violet">
          <Plus className="ml-1 h-4 w-4" /> مشروع جديد
        </button>
      </div>
    </section>
  )
}
