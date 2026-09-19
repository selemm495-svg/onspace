import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Testimonials } from '@/components/testimonials'
import { PricingSection } from '@/components/pricing-section'
import { FAQ } from '@/components/faq'
import { generalFaq, aiModels, testimonials as staticTestimonials, type Testimonial } from '@/lib/data'
import { query, initDb } from '@/lib/db'
import {
  CreditCard,
  Sparkles,
  Server,
  Globe,
  Apple,
  Play,
  ArrowLeft,
  Smartphone,
  Monitor,
} from 'lucide-react'

const buildWithIcons = [Apple, Smartphone, Server, Sparkles, Globe, Monitor, CreditCard, Play]

export default async function Home() {
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
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/4 top-20 h-80 w-80 rounded-full bg-yellow-soft/50 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-32 h-80 w-80 rounded-full bg-pink-soft/50 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6 md:pt-28">
          <h1 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-6xl">
            باني تطبيقات بالذكاء الاصطناعي من غير كود
          </h1>
          <p className="mx-auto mt-4 text-balance text-xl font-bold text-muted-foreground md:text-2xl">
            ابني تطبيقات موبايل وويب في لحظة
          </p>
          <Link
            href="/agentic-app-builder"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95"
          >
            جرّب OnSpace ببلاش
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="mt-12 flex items-end justify-center gap-6">
            <div className="animate-float-slow flex h-28 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-300 shadow-xl">
              <Smartphone className="h-8 w-8 text-violet" />
            </div>
            <div className="flex h-32 w-44 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-300 shadow-xl">
              <Monitor className="h-10 w-10 text-fuchsia-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature pair sections */}
      <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100">
            <CreditCard className="h-9 w-9 text-emerald-600" />
          </div>
          <h3 className="text-xl font-black text-foreground">اكسب فلوس في دقائق</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            الدفع مدمج جوه تطبيقاتك من أول يوم، من غير أي إعداد معقّد.
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet/15 to-fuchsia-200">
            <Sparkles className="h-9 w-9 text-violet" />
          </div>
          <h3 className="text-xl font-black text-foreground">مدعوم بأفضل ذكاء اصطناعي في العالم</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            تطبيقاتك بتتفكّر وتتكتب بأقوى الموديلات المتاحة.
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100">
            <Server className="h-9 w-9 text-teal-600" />
          </div>
          <h3 className="text-xl font-black text-foreground">الـ Backend بتاعك مُدار بالكامل</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            قاعدة بيانات وتخزين وأمان، كله متظبط لوحده على السحابة.
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100">
            <Globe className="h-9 w-9 text-indigo-600" />
          </div>
          <h3 className="text-xl font-black text-foreground">انشر في كل مكان، في لحظة</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            من متجر التطبيقات للويب، تطبيقك بيوصل لكل الناس.
          </p>
        </div>
      </section>

      {/* Build with */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-black text-foreground md:text-4xl">ابني بأقوى التقنيات</h2>
        <p className="mt-2 text-muted-foreground">أفضل التقنيات في العالم في مكان واحد</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {buildWithIcons.map((Icon, i) => (
            <span
              key={i}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm"
            >
              <Icon className="h-5 w-5" />
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-60">
          {aiModels.map((m) => (
            <span key={m} className="text-base font-bold text-muted-foreground" dir="ltr">{m}</span>
          ))}
        </div>
      </section>

      <Testimonials items={testimonialsData} />
      <PricingSection />
      <FAQ items={generalFaq} dark />
      <Footer />
    </main>
  )
}
