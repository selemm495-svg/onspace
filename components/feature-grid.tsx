import { Monitor, Smartphone, Tablet, CreditCard, Database, Apple, Play } from 'lucide-react'
import { agenticFeatures } from '@/lib/data'

function Visual({ kind }: { kind: string }) {
  if (kind === 'devices')
    return (
      <div className="flex items-end justify-center gap-2">
        <div className="flex h-24 w-32 items-center justify-center rounded-lg bg-white/70 shadow-md"><Monitor className="h-7 w-7 text-violet" /></div>
        <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-white/70 shadow-md"><Tablet className="h-6 w-6 text-violet" /></div>
        <div className="flex h-16 w-10 items-center justify-center rounded-lg bg-white/70 shadow-md"><Smartphone className="h-5 w-5 text-violet" /></div>
      </div>
    )
  if (kind === 'pay')
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex w-52 items-center gap-2 rounded-xl bg-white/80 p-3 shadow-md">
          <CreditCard className="h-6 w-6 text-violet" />
          <div className="text-right"><p className="text-xs font-bold text-foreground">Stripe</p><p className="text-[10px] text-muted-foreground">استلمت دفعة ٩٩ ج</p></div>
        </div>
        <div className="flex w-44 items-center gap-2 rounded-xl bg-white/60 p-2.5 shadow-sm">
          <Apple className="h-5 w-5 text-foreground" /><p className="text-xs font-semibold text-foreground">Apple Pay</p>
        </div>
      </div>
    )
  if (kind === 'backend')
    return (
      <div className="w-56 rounded-xl bg-white/80 p-3 shadow-md">
        <div className="mb-2 flex items-center gap-2"><Database className="h-4 w-4 text-violet" /><p className="text-xs font-bold text-foreground">المستخدمين</p></div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="mb-1.5 flex items-center gap-2 rounded-md bg-muted/60 px-2 py-1.5">
            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-violet to-fuchsia-400" />
            <span className="h-2 flex-1 rounded bg-border" />
          </div>
        ))}
      </div>
    )
  return (
    <div className="flex items-end justify-center gap-3">
      <div className="h-28 w-16 rotate-[-8deg] rounded-xl bg-white/80 shadow-md" />
      <div className="h-32 w-16 rotate-[6deg] rounded-xl bg-white/80 shadow-md" />
      <div className="mr-2 flex flex-col gap-1.5">
        <span className="flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[9px] font-bold text-white"><Apple className="h-3 w-3" />App Store</span>
        <span className="flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[9px] font-bold text-white"><Play className="h-3 w-3" />Google Play</span>
      </div>
    </div>
  )
}

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-5 md:grid-cols-2">
        {agenticFeatures.map((f) => (
          <div
            key={f.title}
            className={`flex flex-col gap-5 rounded-3xl bg-gradient-to-br ${f.bg} p-7`}
          >
            <div>
              <h3 className="text-xl font-black text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{f.description}</p>
              <button className="mt-4 rounded-full bg-card px-4 py-2 text-xs font-bold text-foreground shadow-sm transition-transform hover:scale-105">
                جرّب دلوقتي
              </button>
            </div>
            <div className="flex flex-1 items-end justify-center pt-4">
              <Visual kind={f.kind} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
