import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { AuthContextProvider } from '@/context/auth-context'
import { ProviderReactQuerry } from '@/components/provider-react-querry'
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
      <body className={`${getPoppins.className} antialiased`}>
        <ProviderReactQuerry>
          <AuthContextProvider>{children}</AuthContextProvider>
        </ProviderReactQuerry>
      </body>
    </html>
  )
}
