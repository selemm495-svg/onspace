import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AIBuilder } from '@/components/ai-builder'
import { CommunityGrid } from '@/components/community-grid'
import { ProjectsSection } from '@/components/projects-section'
import { FinalCTA } from '@/components/final-cta'
import { communityProjects as staticCommunity, type CommunityProject } from '@/lib/data'
import { query, initDb } from '@/lib/db'
import { Monitor } from 'lucide-react'

export default async function WebsitePage() {
  await initDb()
  let communityData: CommunityProject[] = staticCommunity
  try {
    const { rows } = await query('SELECT title, gradient, emoji_hint FROM community_projects ORDER BY id')
    if (rows.length > 0) {
      communityData = rows.map((r) => ({
        title: r.title,
        gradient: r.gradient,
        emojiHint: r.emoji_hint,
      }))
    }
  } catch {
    // fallback to static
  }

  return (
    <main className="min-h-screen">
      <Navbar credits={1500} />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-pink-soft/60 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 pb-6 pt-16 text-center sm:px-6 md:pt-24">
          <h1 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-6xl">
            من غير كود.
            <br />
            ابني تطبيقات ويب كاملة
          </h1>
          <p className="mx-auto mt-4 text-lg text-muted-foreground">من الفكرة للإطلاق في دقائق.</p>

          <div className="relative mx-auto my-8 flex h-40 items-center justify-center">
            <div className="animate-float-slow flex h-24 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-300 p-3 shadow-2xl">
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-neutral-900">
                <Monitor className="h-8 w-8 text-fuchsia-400" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-2xl text-right">
            <AIBuilder
              placeholder="اطلب من OnSpace يعملّك صفحة هبوط لـ..."
              controls={['framework', 'backend', 'visibility']}
              type="web"
            />
          </div>
        </div>
      </section>

      <ProjectsSection type="web" />
      <CommunityGrid projects={communityData} />
      <FinalCTA title="جاهز تطلق موقعك؟" cta="ابدأ البناء" />
      <Footer />
    </main>
  )
}
