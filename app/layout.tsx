import type React from 'react'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OnSpace — ابنِ تطبيقاتك بالذكاء الاصطناعي من غير كود',
  description:
    'منصة OnSpace لبناء تطبيقات الويب والموبايل بالذكاء الاصطناعي. من فكرة لتطبيق حقيقي في دقائق، من غير ما تكتب سطر كود واحد.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${tajawal.variable} bg-background`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
