export type NavItem = {
  label: string
  href: string
  icon: 'agentic' | 'mobile' | 'website' | 'pricing'
}

export const navItems: NavItem[] = [
  { label: 'وكيل ذكي', href: '/agentic-app-builder', icon: 'agentic' },
  { label: 'iOS و أندرويد', href: '/ios-app-builder', icon: 'mobile' },
  { label: 'مواقع', href: '/ai-website-builder', icon: 'website' },
  { label: 'الأسعار', href: '/pricing', icon: 'pricing' },
]

export const aiModels = [
  'OpenAI',
  'Claude',
  'Qwen',
  'Grok',
  'Gemini',
  'DeepSeek',
]

export const agenticChips = [
  { label: 'مصمم أوض بالذكاء', prompt: 'اعملّي أداة تصمّم أوض وديكورات من صورة الأوضة بتاعتي' },
  { label: 'مولّد صور شخصية', prompt: 'اعملّي أداة تطلع صورة شخصية رسمية من أي صورة' },
  { label: 'مولّد إعلانات Sora2', prompt: 'اعملّي أداة تعمل إعلانات فيديو قصيرة للمنتجات' },
  { label: 'تطبيق رفيق ذكي', prompt: 'اعملّي تطبيق شخصية ذكية بتتكلم معايا وتساعدني' },
]

export type Feature = {
  title: string
  description: string
  bg: string
  kind: 'devices' | 'pay' | 'backend' | 'phones'
}

export const agenticFeatures: Feature[] = [
  {
    title: 'اشتغل في أي مكان وعلى أي جهاز',
    description: 'تطبيقك جاهز على طول، أي حد يقدر يفتحه من الموبايل أو الكمبيوتر بكليكة واحدة.',
    bg: 'from-pink-soft/60 to-lavender/60',
    kind: 'devices',
  },
  {
    title: 'اكسب فلوس من أول يوم',
    description: 'الدفع مدمج جوه التطبيق، من غير أي تعقيد. Apple Pay و Google Pay و Stripe كلهم متظبطين.',
    bg: 'from-lavender/70 to-violet-soft/30',
    kind: 'pay',
  },
  {
    title: 'الـ Backend بتاعك مدار بالكامل',
    description: 'قاعدة بيانات وتخزين وأمان، كله متظبط لوحده على السحابة. اكبر من غير ما تفكر في الخوادم.',
    bg: 'from-cyan-soft/60 to-lavender/50',
    kind: 'backend',
  },
  {
    title: 'ابني تطبيقات من موبايلك',
    description: 'فكرتك تفضل معاك، اعمل وعدّل تطبيقك من أي مكان بمولّد التطبيقات على الموبايل.',
    bg: 'from-lavender/70 to-violet-soft/25',
    kind: 'phones',
  },
]

export type Testimonial = { text: string; name: string; role: string }

export const testimonials: Testimonial[] = [
  { text: 'عملت أول تطبيق ليا وأنا شارب قهوتي الصبح، ونزلته في نفس اليوم.', name: 'كريم صابر', role: 'مصمم منتجات' },
  { text: 'بعدّل من موبايلي وأنا في المواصلات، ده غيّر شغلي بجد.', name: 'آية محمود', role: 'مؤسِّسة ستارت أب' },
  { text: 'عملت نموذج في ٤٥ دقيقة، العميل فاكر إنه خد أسبوع.', name: 'ستيفن قليني', role: 'فريلانسر' },
  { text: 'صفر كود وصفر وجع دماغ، دلوقتي بـ ١.٢٠ دولار في الشهر.', name: 'دانيال رأفت', role: 'صاحب متجر' },
]

export type FaqItem = { q: string; a: string }

export const agenticFaq: FaqItem[] = [
  { q: 'يعني إيه تطبيق وكيل ذكي (Agentic)؟', a: 'تطبيق بيستخدم الذكاء الاصطناعي مش بس عشان يرد عليك، لكن عشان ينفّذ مهام كاملة لوحده ويطلعلك نتيجة تقدر تشاركها مع أي حد.' },
  { q: 'ليه بناء التطبيقات الذكية مهم للكل؟', a: 'لإنه بيخلي أي حد، حتى من غير خبرة برمجة، يقدر يحوّل فكرته لمنتج شغّال ويكسب منه.' },
  { q: 'أقدر أعمل أنهي نوع تطبيقات؟', a: 'أدوات صور، مولّدات محتوى، تطبيقات رفيق ذكي، أدوات إنتاجية، وأي حاجة تخطر على بالك تقريبًا.' },
  { q: 'إيه الفرق بينه وبين أدوات No-Code التقليدية؟', a: 'الفرق إن الذكاء الاصطناعي بيبني ويكتب المنطق بنفسه، مش بس بتركّب بلوكات جاهزة.' },
  { q: 'أنهي موديلات ذكاء اصطناعي متكاملة مع المنصة؟', a: 'أقوى الموديلات زي OpenAI و Claude و Gemini و Qwen و Grok وغيرهم.' },
  { q: 'محتاج أربط APIs خارجية أو أدفع لخدمات تانية؟', a: 'لأ، كل حاجة متظبطة جوه المنصة، من غير ما تدور على أي خدمة برّه.' },
  { q: 'الـ workflow بيشتغل إزاي؟', a: 'بتكتب فكرتك بالعربي، والمنصة بتفهمها وتبني التطبيق وتنشره خطوة بخطوة قدامك.' },
  { q: 'المنصة متاحة على كل الأجهزة؟', a: 'آه، شغالة على الويب و iOS و أندرويد.' },
  { q: 'أقدر أعدّل أو أطوّر التطبيق بعد ما يتعمل؟', a: 'طبعًا، تقدر تكمّل تطوير وتضيف مميزات في أي وقت.' },
  { q: 'أقدر أصدّر الكود؟', a: 'آه، تقدر تنزّل الكود وتستضيفه في أي مكان تحبه.' },
  { q: 'مين يقدر يستفيد من المنصة؟', a: 'المؤسسين، الفريلانسرز، المصممين، وأي حد عنده فكرة عايز ينفّذها بسرعة.' },
]

export const generalFaq: FaqItem[] = [
  { q: 'أقدر أبني إيه مع OnSpace؟', a: 'تطبيقات ويب وموبايل كاملة، من فكرة بسيطة لمنتج جاهز للنشر.' },
  { q: 'محتاج خبرة برمجة عشان أبني تطبيق؟', a: 'خالص، بتكتب فكرتك بالعربي والمنصة بتعمل الباقي.' },
  { q: 'التطبيق الكامل بياخد وقت قد إيه؟', a: 'دقائق مش شهور، من الفكرة للنشر.' },
  { q: 'محتاج CTO للـ MVP بتاعي؟', a: 'مش محتاج، المنصة بتعملك الـ backend والـ frontend كلهم.' },
  { q: 'إيه هو Supabase وبيساعد إزاي؟', a: 'قاعدة بيانات وخدمات جاهزة تقدر تربطها بتطبيقك لو حبيت تحكّم أكتر.' },
  { q: 'أقدر أصدّر مشروعي وأستضيفه في مكان تاني؟', a: 'آه، الكود ملكك تنزّله وتستضيفه في أي مكان.' },
  { q: 'أقدر أضيف أنظمة دفع؟', a: 'طبعًا، الدفع مدمج وجاهز من أول يوم.' },
  { q: 'أقدر أنزّل الكود اللي المنصة بتعمله؟', a: 'آه، الكود متاح للتحميل بالكامل.' },
]

export type CommunityProject = {
  title: string
  gradient: string
  emojiHint: string
}

export const communityProjects: CommunityProject[] = [
  { title: 'من APK لـ QR كود', gradient: 'from-slate-100 to-slate-200', emojiHint: 'QR' },
  { title: 'مفكّك الأحلام السايبربانك', gradient: 'from-fuchsia-900 to-indigo-900', emojiHint: 'CP' },
  { title: 'SketchFlow', gradient: 'from-indigo-200 to-sky-200', emojiHint: 'SF' },
  { title: 'X Roaster', gradient: 'from-neutral-900 to-orange-950', emojiHint: 'XR' },
  { title: 'تحويل الصور', gradient: 'from-neutral-900 to-neutral-800', emojiHint: 'IC' },
  { title: 'مولّد اللوجوهات', gradient: 'from-indigo-950 to-fuchsia-900', emojiHint: 'LG' },
  { title: 'صور الكريسماس', gradient: 'from-rose-100 to-amber-100', emojiHint: 'XP' },
  { title: 'استوديو تعديل العربيات', gradient: 'from-neutral-900 to-amber-950', emojiHint: 'CT' },
  { title: 'وصفات من التلاجة', gradient: 'from-amber-100 to-orange-100', emojiHint: 'FR' },
  { title: 'المواهب الرقمية', gradient: 'from-slate-100 to-slate-200', emojiHint: 'DT' },
  { title: 'مولّد الصور الشخصية', gradient: 'from-neutral-800 to-neutral-900', emojiHint: 'ID' },
  { title: 'واجهة Jarvis', gradient: 'from-teal-900 to-emerald-900', emojiHint: 'JV' },
]

export type PricingPlan = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'مجاني',
    price: '٠',
    period: 'للأبد',
    description: 'ابدأ وجرّب المنصة من غير أي التزام.',
    features: ['مشاريع عامة', 'باني تطبيقات iOS و ويب', 'وضع الوكيل الذكي (أساسي)', 'محرر الكود'],
    cta: 'ابدأ ببلاش',
  },
  {
    name: 'برو',
    price: '٢٥',
    period: 'شهريًا',
    description: 'لأصحاب المشاريع اللي عايزين يوصلوا لأبعد.',
    features: ['كل مميزات المجاني', 'مشاريع خاصة', 'رصيد أعلى للذكاء الاصطناعي', 'مميزات متقدمة', 'دعم أولوية'],
    cta: 'شوف كل الباقات',
    highlighted: true,
  },
  {
    name: 'فِرق',
    price: '٩٩',
    period: 'شهريًا',
    description: 'للفرق اللي بتشتغل وبتنشر مع بعض.',
    features: ['كل مميزات برو', 'مساحات عمل للفرق', 'صلاحيات وأدوار', 'تعاون لحظي', 'دعم مخصّص'],
    cta: 'كلّم المبيعات',
  },
]
