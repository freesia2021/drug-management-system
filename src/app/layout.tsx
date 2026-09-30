import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '../components/providers'
import { AuthGuard } from '../components/auth'

export const metadata: Metadata = {
  title: '독성물질 자료관리 시스템',
  description: '의료진을 위한 마약류 관리 솔루션',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-pretendard">
        <QueryProvider>
          <AuthGuard>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </AuthGuard>
        </QueryProvider>
      </body>
    </html>
  )
}
