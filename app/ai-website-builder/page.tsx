import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AIBuilder } from '@/components/ai-builder'
import { CommunityGrid } from '@/components/community-grid'
import { FinalCTA } from '@/components/final-cta'
import { Monitor, Plus } from 'lucide-react'

export default function WebsitePage() {
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
            />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-8 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-full bg-gradient-to-br from-violet via-fuchsia-500 to-orange-400" />
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">مشاريع user_05668</p>
            <p className="text-xs text-muted-foreground">لا يوجد مشاريع</p>
          </div>
        </div>
        <div className="mt-6 max-w-xs">
          <button className="flex min-h-44 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm font-semibold text-muted-foreground transition-colors hover:border-violet/40 hover:text-violet">
            <Plus className="ml-1 h-4 w-4" /> مشروع جديد
          </button>
        </div>
      </section>

      <CommunityGrid />
      <FinalCTA title="جاهز تطلق موقعك؟" cta="ابدأ البناء" />
      <Footer />
    </main>
  )
}
