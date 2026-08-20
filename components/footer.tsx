import Link from 'next/link'
import { Code2, Play, Mail } from 'lucide-react'
import { Logo } from '@/components/navbar'

const columns = [
  {
    title: 'المنتج',
    links: ['شرح Spaces الكامل', 'شرح iOS API', 'تكامل Supabase', 'تحميل APK', 'استيراد من Figma', 'باني تطبيقات الموبايل', 'باني تطبيقات الويب'],
  },
  {
    title: 'مصادر',
    links: ['تعلّم', 'سجل التغييرات', 'الدعم', 'الأسئلة الشائعة', 'المدونة', 'الأسعار', 'الموديلات'],
  },
  {
    title: 'المجتمع',
    links: ['Discord', 'برنامج الشركاء'],
  },
  {
    title: 'التحميل',
    links: ['iOS', 'أندرويد'],
  },
  {
    title: 'مميّز',
    links: ['Loqua'],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-violet">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
              العربية (مصر)
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-violet">سياسة الخصوصية</Link>
            <Link href="#" className="transition-colors hover:text-violet">الشروط</Link>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Link href="#" aria-label="GitHub" className="transition-colors hover:text-violet"><Code2 className="h-4.5 w-4.5" /></Link>
            <Link href="#" aria-label="YouTube" className="transition-colors hover:text-violet"><Play className="h-4.5 w-4.5" /></Link>
            <Link href="#" aria-label="البريد" className="transition-colors hover:text-violet"><Mail className="h-4.5 w-4.5" /></Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © ٢٠٢٦ OnSpace. كل الحقوق محفوظة.
        </p>
      </div>
    </footer>
  )
}
