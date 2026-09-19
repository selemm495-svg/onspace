import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AIBuilder } from '@/components/ai-builder'
import { ExampleChips } from '@/components/example-chips'
import { FeatureGrid } from '@/components/feature-grid'
import { ProjectsSection } from '@/components/projects-section'
import { Testimonials } from '@/components/testimonials'
import { PricingSection } from '@/components/pricing-section'
import { FAQ } from '@/components/faq'
import { FinalCTA } from '@/components/final-cta'
import { agenticFaq, aiModels, testimonials as staticTestimonials, type Testimonial } from '@/lib/data'
import { query, initDb } from '@/lib/db'
import { Sparkles } from 'lucide-react'

export default async function AgenticPage() {
  await initDb()
  let testimonialsData: Testimonial[] = staticTestimonials
  try {
    const { rows } = await query('SELECT text, name, role FROM testimonials ORDER BY id')
    if (rows.length > 0) testimonialsData = rows
  } catch {
    // fallback to static
  }

  return (
    <main className="min-h-screen">
      <Navbar credits={20} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="perspective-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:px-6 md:pt-24">
          <h1 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-6xl">
            باني تطبيقات <span className="gradient-text">الوكيل الذكي</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
            حوّل الذكاء الاصطناعي لتطبيقات تقدر تشاركها مع أي حد، في أي مكان.
          </p>

          <div className="mx-auto mt-10 max-w-2xl text-right">
            <AIBuilder
              placeholder="اطلب من OnSpace يعملّك تطبيق صور بالذكاء الاصطناعي..."
              controls={['visibility', 'platform']}
              type="agentic"
            />
            <ExampleChips />
          </div>
        </div>
      </section>

      {/* What's an Agentic App */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-black text-foreground md:text-4xl">
          يعني إيه تطبيق وكيل ذكي؟
        </h2>
        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-lavender/40 to-card p-6 shadow-xl md:p-10">
          <div className="grid gap-4 md:grid-cols-3">
            {['مصمم أوض', 'مولّد صور شخصية', 'مولّد إعلانات'].map((t, i) => (
              <div key={t} className="rounded-2xl bg-card p-4 shadow-md">
                <div className={`mb-3 h-32 rounded-xl bg-gradient-to-br ${
                  i === 0 ? 'from-amber-100 to-rose-100' : i === 1 ? 'from-sky-100 to-indigo-100' : 'from-fuchsia-100 to-violet-100'
                }`} />
                <p className="text-sm font-bold text-foreground">{t}</p>
                <p className="mt-1 text-xs text-muted-foreground">تطبيق كامل شغّال جاهز للمشاركة</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build with top AI models */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="text-right">
            <h2 className="text-3xl font-black text-foreground md:text-4xl">
              ابني بأقوى موديلات الذكاء الاصطناعي
            </h2>
            <p className="mt-3 text-muted-foreground">
              من موديلات فيديو Sora2 لموديلات الصور، عندك أقوى الموديلات عشان تبني تطبيقات جبّارة على طول.
            </p>
            <div className="mt-6 flex gap-3">
              <button className="rounded-full bg-gradient-to-l from-violet to-violet-soft px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105">
                ابنِ تطبيق ذكي
              </button>
              <button className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted">
                اعرف أكتر
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-violet/20 via-fuchsia-300/20 to-transparent">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet to-violet-soft shadow-xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
          {aiModels.map((m) => (
            <span key={m} className="text-lg font-bold text-muted-foreground" dir="ltr">{m}</span>
          ))}
        </div>
      </section>

      <FeatureGrid />
      <ProjectsSection type="agentic" />
      <Testimonials items={testimonialsData} />
      <PricingSection />
      <FAQ items={agenticFaq} />
      <FinalCTA />
      <Footer />
    </main>
  )
}
