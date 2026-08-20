import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PricingSection } from '@/components/pricing-section'
import { FAQ } from '@/components/faq'
import { FinalCTA } from '@/components/final-cta'
import { generalFaq } from '@/lib/data'
import { Check, X } from 'lucide-react'

const comparison = [
  { feature: 'مشاريع عامة', free: true, pro: true, team: true },
  { feature: 'مشاريع خاصة', free: false, pro: true, team: true },
  { feature: 'رصيد الذكاء الاصطناعي', free: 'محدود', pro: 'عالي', team: 'غير محدود' },
  { feature: 'وضع الوكيل الذكي', free: 'أساسي', pro: 'متقدم', team: 'متقدم' },
  { feature: 'مساحات عمل للفرق', free: false, pro: false, team: true },
  { feature: 'دعم أولوية', free: false, pro: true, team: true },
  { feature: 'تصدير الكود', free: true, pro: true, team: true },
]

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === 'string')
    return <span className="text-sm font-semibold text-foreground">{value}</span>
  return value ? (
    <Check className="mx-auto h-5 w-5 text-violet" />
  ) : (
    <X className="mx-auto h-5 w-5 text-muted-foreground/40" />
  )
}

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar credits={1500} />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-lavender/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 pt-20 text-center sm:px-6 md:pt-24">
          <h1 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl">
            أسعار واضحة، تكبر مع نجاحك
          </h1>
          <p className="mx-auto mt-4 text-lg text-muted-foreground">
            ابدأ ببلاش، وارقِّي باقتك وقت ما تحتاج. من غير أي مفاجآت.
          </p>
        </div>
      </section>

      <PricingSection title="" subtitle="" />

      {/* Comparison table */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-black text-foreground md:text-3xl">
          مقارنة المميزات
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-right">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-sm font-bold text-foreground">الميزة</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-foreground">مجاني</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-violet">برو</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-foreground">فِرق</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={row.feature} className={i % 2 ? 'bg-muted/30' : 'bg-card'}>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{row.feature}</td>
                  <td className="px-4 py-3 text-center"><Cell value={row.free} /></td>
                  <td className="px-4 py-3 text-center"><Cell value={row.pro} /></td>
                  <td className="px-4 py-3 text-center"><Cell value={row.team} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FAQ items={generalFaq} />
      <FinalCTA title="جاهز تبدأ؟" cta="ابدأ ببلاش" />
      <Footer />
    </main>
  )
}
