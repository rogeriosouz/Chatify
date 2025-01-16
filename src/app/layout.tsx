import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const getPoppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Login',
  description: 'login app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt_BR">
      <body className={`${getPoppins.className} antialiased`}>{children}</body>
    </html>
  )
}
