export function FinalCTA({
  title = 'إيه فكرتك الكبيرة الجاية؟',
  cta = 'ابدأ البناء',
}: {
  title?: string
  cta?: string
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cyan-soft/40 to-lavender/60 py-24">
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-balance text-3xl font-black text-foreground md:text-5xl">{title}</h2>
        <button className="mt-8 rounded-full bg-gradient-to-l from-violet to-violet-soft px-8 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
          {cta}
        </button>
        <div className="mx-auto mt-12 h-32 w-32 animate-float-slow rounded-full bg-gradient-to-br from-neutral-300 via-neutral-100 to-neutral-400 shadow-2xl ring-1 ring-white/50">
          <div className="flex h-full w-full items-center justify-center text-4xl font-black text-neutral-500">
            O
          </div>
        </div>
      </div>
    </section>
  )
}
