import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { FirebaseProvider } from '@/contexts/FirebaseContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UniAgric - Agricultural Investment Platform',
  description: 'Connect farmers with investors to grow sustainable agriculture',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseProvider>
            {children}
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
