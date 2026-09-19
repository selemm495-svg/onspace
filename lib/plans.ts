export type PlanDefinition = {
  name: string
  price: number
  period: string
  description: string
  features: string[]
  credits: number
  maxProjects: number
  maxTeamMembers: number
  storageMB: number
  canExport: boolean
  canShare: boolean
  canCollaborate: boolean
  active: boolean
  sortOrder: number
}

export const seedPlans: PlanDefinition[] = [
  {
    name: 'مجاني',
    price: 0,
    period: 'للأبد',
    description: 'ابدأ وجرّب المنصة من غير أي التزام.',
    features: ['مشاريع عامة', 'باني تطبيقات iOS و ويب', 'وضع الوكيل الذكي (أساسي)', 'محرر الكود'],
    credits: 1500,
    maxProjects: 5,
    maxTeamMembers: 1,
    storageMB: 100,
    canExport: false,
    canShare: true,
    canCollaborate: false,
    active: true,
    sortOrder: 0,
  },
  {
    name: 'برو',
    price: 25,
    period: 'شهريًا',
    description: 'لأصحاب المشاريع اللي عايزين يوصلوا لأبعد.',
    features: ['كل مميزات المجاني', 'مشاريع خاصة', 'رصيد أعلى للذكاء الاصطناعي', 'مميزات متقدمة', 'دعم أولوية', 'تصدير الكود'],
    credits: 10000,
    maxProjects: 50,
    maxTeamMembers: 3,
    storageMB: 5000,
    canExport: true,
    canShare: true,
    canCollaborate: true,
    active: true,
    sortOrder: 1,
  },
  {
    name: 'فِرق',
    price: 99,
    period: 'شهريًا',
    description: 'للفرق اللي بتشتغل وبتنشر مع بعض.',
    features: ['كل مميزات برو', 'مساحات عمل للفرق', 'صلاحيات وأدوار', 'تعاون لحظي', 'دعم مخصص', 'مساحة تخزين كبيرة'],
    credits: 50000,
    maxProjects: 999,
    maxTeamMembers: 20,
    storageMB: 50000,
    canExport: true,
    canShare: true,
    canCollaborate: true,
    active: true,
    sortOrder: 2,
  },
]

export const planIdByName: Record<string, number> = {
  'مجاني': 1,
  'برو': 2,
  'فِرق': 3,
}
