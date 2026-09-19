export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-app-building-guide',
    title: 'كيف تبني تطبيقات بالذكاء الاصطناعي: دليل المبتدئين',
    excerpt:
      'تعرف على كيفية استخدام الذكاء الاصطناعي لبناء تطبيقات الويب والموبايل بدون كتابة سطر كود واحد.',
    date: '١٥ سبتمبر ٢٠٢٦',
    category: 'ذكاء اصطناعي',
    readTime: '٥ دقائق',
  },
  {
    slug: 'no-code-revolution',
    title: 'ثورة الـ No-Code: لماذا يتغير العالم الآن',
    excerpt: 'كيف تغير منصات الـ No-Code طريقة بناء البرمجيات وتجعلها متاحة للجميع.',
    date: '١٠ سبتمبر ٢٠٢٦',
    category: 'تقنية',
    readTime: '٧ دقائق',
  },
  {
    slug: 'mobile-first-design',
    title: 'تصميم الموبايل أولاً: أفضل الممارسات',
    excerpt: 'لماذا يجب أن يبدأ تصميم تطبيقك من الموبايل، وكيف تحسن تجربة المستخدم.',
    date: '٥ سبتمبر ٢٠٢٦',
    category: 'تصميم',
    readTime: '٤ دقائق',
  },
  {
    slug: 'monetize-your-app',
    title: 'كيف تربح من تطبيقك: ٥ استراتيجيات مجربة',
    excerpt: 'من الاشتراكات للإعلانات للمدفوعات داخل التطبيق، استراتيجيات لتحقيق دخل من تطبيقك.',
    date: '١ سبتمبر ٢٠٢٦',
    category: 'أعمال',
    readTime: '٦ دقائق',
  },
  {
    slug: 'supabase-integration',
    title: 'ربط Supabase بتطبيقك: خطوة بخطوة',
    excerpt: 'دليل عملي لربط قاعدة بيانات Supabase بتطبيقك على OnSpace.',
    date: '٢٨ أغسطس ٢٠٢٦',
    category: 'تطوير',
    readTime: '٨ دقائق',
  },
  {
    slug: 'agentic-apps-future',
    title: 'تطبيقات الوكيل الذكي: مستقبل التطبيقات',
    excerpt: 'ما هي التطبيقات الذكية وكيف ستغير طريقة تفاعلنا مع التكنولوجيا.',
    date: '٢٠ أغسطس ٢٠٢٦',
    category: 'ذكاء اصطناعي',
    readTime: '٥ دقائق',
  },
]

export type ChangelogEntry = {
  version: string
  date: string
  changes: string[]
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: '٢.٠.٠',
    date: '١٥ سبتمبر ٢٠٢٦',
    changes: [
      'إطلاق باني التطبيقات الذكي (Agentic App Builder)',
      'دعم موديلات ذكاء اصطناعي جديدة: GPT-5 و Claude 4',
      'تحسين سرعة بناء التطبيقات بنسبة ٤٠٪',
      'واجهة مستخدم محدثة بالكامل',
    ],
  },
  {
    version: '١.٨.٠',
    date: '١ أغسطس ٢٠٢٦',
    changes: [
      'إضافة تكامل Supabase للقواعد بيانات',
      'دعم تصدير الكود بصيغة React و HTML',
      'تحسينات على محرر الكود',
    ],
  },
  {
    version: '١.٥.٠',
    date: '١٥ يونيو ٢٠٢٦',
    changes: [
      'إطلاق باني تطبيقات iOS و أندرويد',
      'دعم Apple Pay و Google Pay',
      'تحسين أداء التطبيقات على الموبايل',
    ],
  },
  {
    version: '١.٠.٠',
    date: '١ يناير ٢٠٢٦',
    changes: [
      'إطلاق OnSpace للعامة',
      'باني تطبيقات ويب بالذكاء الاصطناعي',
      'دعم اللغة العربية بالكامل',
    ],
  },
]
