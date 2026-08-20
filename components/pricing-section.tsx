import { Check, ShieldCheck } from 'lucide-react'
import { pricingPlans } from '@/lib/data'
import { cn } from '@/lib/utils'

export function PricingSection({
  title = 'باقات بتكبر مع نجاحك',
  subtitle = 'ابدأ صغير، واكبر بسلاسة.',
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-black text-foreground md:text-4xl">{title}</h2>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-violet" />
          دفع آمن وسهل
        </span>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'flex flex-col rounded-3xl border p-7',
              plan.highlighted
                ? 'border-violet/30 bg-gradient-to-b from-lavender/60 to-card shadow-xl shadow-violet/10'
                : 'border-border bg-card',
            )}
          >
            <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-4xl font-black text-foreground">
                {plan.price === '٠' ? 'مجانًا' : `$${plan.price}`}
              </span>
              {plan.price !== '٠' && <span className="mb-1.5 text-sm text-muted-foreground">/ {plan.period}</span>}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-violet" />
                  {feat}
                </li>
              ))}
            </ul>
            <button
              className={cn(
                'mt-7 rounded-full py-2.5 text-sm font-bold transition-transform hover:scale-[1.02] active:scale-95',
                plan.highlighted
                  ? 'bg-gradient-to-l from-violet to-violet-soft text-white shadow-md'
                  : 'bg-foreground text-background',
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
