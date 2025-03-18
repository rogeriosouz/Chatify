import { Toaster } from '@/components/ui/sonner'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="w-full h-screen grid grid-cols-[480px,1fr]">
        <section className="w-full pt-48">{children}</section>

        <section className="w-full bg-secondary space-y-2 flex-col flex items-center justify-center">
          <h1 className="text-bold font-medium text-2xl">
            You should, Chatify!
          </h1>

          <Image
            width={597}
            height={534}
            src={'/images/Delivery.svg'}
            alt="image-auth"
          />
        </section>
      </main>

      <Toaster position="top-left" />
    </>
  )
}
