import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AIBuilder } from '@/components/ai-builder'
import { FAQ } from '@/components/faq'
import { FinalCTA } from '@/components/final-cta'
import { generalFaq } from '@/lib/data'
import { Plus, Smartphone } from 'lucide-react'

export default function IosPage() {
  return (
    <main className="min-h-screen">
      <Navbar credits={1500} />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-soft/60 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 pb-6 pt-16 text-center sm:px-6 md:pt-24">
          <h1 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-6xl">
            ابني تطبيقات iOS و أندرويد.
            <br />
            في لحظة. من غير كود.
          </h1>
          <p className="mx-auto mt-4 text-lg text-muted-foreground">
            فكرة ← شات ← متجر التطبيقات
          </p>

          <div className="relative mx-auto my-8 flex h-40 items-center justify-center">
            <div className="animate-float-slow flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-200 to-yellow-100 shadow-2xl">
              <Smartphone className="h-10 w-10 text-amber-700" />
            </div>
          </div>

          <div className="mx-auto max-w-2xl text-right">
            <AIBuilder
              placeholder="اطلب من OnSpace يعملّك تطبيق يومي..."
              controls={['backend', 'visibility']}
            />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-full bg-gradient-to-br from-violet via-fuchsia-500 to-orange-400" />
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">مشاريع user_05668</p>
            <p className="text-xs text-muted-foreground">مشروع واحد</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-neutral-900 p-4 text-white shadow-sm transition-transform hover:-translate-y-1">
            <p className="mb-3 text-right text-sm font-bold">الرئيسية</p>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-white/5" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 rounded-lg bg-white/5" />
                <div className="h-10 rounded-lg bg-white/5" />
              </div>
            </div>
          </div>

          <button className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm font-semibold text-muted-foreground transition-colors hover:border-violet/40 hover:text-violet">
            <Plus className="ml-1 h-4 w-4" /> مشروع جديد
          </button>

          <div className="flex min-h-44 flex-col justify-center rounded-2xl bg-fuchsia-200 p-6 text-center">
            <span className="mx-auto mb-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-foreground">إزاي</span>
            <p className="text-lg font-black leading-tight text-foreground">تبني تطبيق يكسب فلوس من غير كود؟</p>
          </div>

          <div className="flex min-h-44 flex-col justify-center rounded-2xl bg-cyan-200 p-6 text-center">
            <span className="mx-auto mb-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-foreground">إزاي</span>
            <p className="text-lg font-black leading-tight text-foreground">تبني قاعدة بيانات مع Spaces</p>
          </div>
        </div>
      </section>

      <FAQ items={generalFaq} />
      <FinalCTA title="جاهز تنشر تطبيقك على المتجر؟" cta="ابدأ دلوقتي" />
      <Footer />
    </main>
  )
}
