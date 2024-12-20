import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Erasor Clone',
  description: 'Your digital canvas for ideas and creativity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-purple-800">
                  Erasor Clone
                </Link>
              </div>
              <div className="flex">
                <Link href="/draw" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                  Drawing Board
                </Link>
                <Link href="/notes" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                  Notepad
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

