import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Dancing_Script } from 'next/font/google';
import './globals.css'
import Navigation from './components/Navigation'
import SplashScreenController from './components/SplashScreenController'

const inter = Inter({ subsets: ['latin'] })
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
})

export const metadata: Metadata = {
  title: 'Leadership Connections NC',
  description: 'Empowering young girls to become strong leaders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dancingScript.variable}`}>
      <body className={inter.className}>
        <SplashScreenController>
          <Navigation />
          {children}
        </SplashScreenController>
      </body>
    </html>
  )
}
