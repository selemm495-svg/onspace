export type ProfessionOption = {
  value: string
  label: string
}

export const professions: ProfessionOption[] = [
  { value: 'content_creator', label: 'صانع محتوى' },
  { value: 'developer', label: 'مبرمج' },
  { value: 'designer', label: 'مصمم' },
  { value: 'marketer', label: 'مسوق' },
  { value: 'writer', label: 'كاتب' },
  { value: 'entrepreneur', label: 'رائد أعمال' },
  { value: 'business_owner', label: 'صاحب مشروع' },
  { value: 'company', label: 'شركة' },
  { value: 'agency', label: 'وكالة' },
  { value: 'student', label: 'طالب' },
  { value: 'freelancer', label: 'مستقل' },
  { value: 'other', label: 'مجال مخصص' },
]

export function professionLabel(value: string | null): string | null {
  if (!value) return null
  return professions.find((p) => p.value === value)?.label ?? value
}
