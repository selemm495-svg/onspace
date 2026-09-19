import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FinalCTA } from '@/components/final-cta'
import { changelogEntries } from '@/lib/blog-data'

export default function ChangelogPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-soft/60 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 pt-20 pb-8 text-center sm:px-6 md:pt-24">
          <h1 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl">
            سجل التغييرات
          </h1>
          <p className="mx-auto mt-4 text-lg text-muted-foreground">
            كل تحديثات وتحسينات منصة OnSpace
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <div className="relative">
          {changelogEntries.map((entry, i) => (
            <div key={entry.version} className="relative pb-10 pr-8">
              {i < changelogEntries.length - 1 && (
                <div className="absolute right-3 top-4 h-full w-px bg-border" />
              )}
              <div className="absolute right-0 top-1.5 h-6 w-6 rounded-full bg-gradient-to-br from-violet to-violet-soft ring-4 ring-background" />
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-violet/10 px-3 py-1 text-sm font-black text-violet">
                    v{entry.version}
                  </span>
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {entry.changes.map((change, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FinalCTA title="جاهز تبدأ؟" cta="ابدأ ببلاش" />
      <Footer />
    </main>
  )
}
