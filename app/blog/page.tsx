import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { blogPosts } from '@/lib/blog-data'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Navbar credits={1500} />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-lavender/70 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 pt-20 pb-8 text-center sm:px-6 md:pt-24">
          <h1 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl">
            المدونة
          </h1>
          <p className="mx-auto mt-4 text-lg text-muted-foreground">
            مقالات وإرشادات عن بناء التطبيقات بالذكاء الاصطناعي
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-violet/10 via-fuchsia-200/30 to-lavender/40">
                <span className="text-4xl font-black text-violet/20" dir="ltr">
                  {post.category.slice(0, 2)}
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-violet/10 px-2 py-0.5 font-bold text-violet">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-black text-foreground">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <button className="mt-4 flex items-center gap-1 text-sm font-bold text-violet transition-transform hover:gap-2">
                  اقرأ المزيد
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
