import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AIBuilder } from '@/components/ai-builder'
import { FAQ } from '@/components/faq'
import { FinalCTA } from '@/components/final-cta'
import { ProjectsSection } from '@/components/projects-section'
import { generalFaq } from '@/lib/data'
import { Smartphone } from 'lucide-react'

export default async function IosPage() {
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
              type="mobile"
            />
          </div>
        </div>
      </section>

      <ProjectsSection type="mobile" />

      {/* How-to cards */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
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
