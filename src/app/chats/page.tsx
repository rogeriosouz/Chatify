'use client'
import Image from 'next/image'
import { useAuth } from '@/context/auth-context'
import Link from 'next/link'
import { Pen } from '@phosphor-icons/react'
import { ListFriends } from './components/list-friends'
import { useMediaQuery } from 'usehooks-ts'

export default function Chats() {
  const { user } = useAuth()
  const lgMediaMobile = useMediaQuery('(max-width: 1023px)')

  return (
    <main className="w-full xl:flex-col relative flex items-center">
      <div className="w-full hidden xl:flex py-2 px-5 items-center gap-2 absolute top-0 left-0 right-0 border-b bg-secondary">
        {!user && (
          <div className="size-20 rounded-full bg-zinc-900/10 animate-pulse"></div>
        )}

        <div className="relative size-14 group rounded-full">
          {user && (
            <Image
              width={56}
              height={56}
              src={user.imageUrl}
              alt={user.name}
              className="rounded-full object-cover"
            />
          )}

          <Link
            href={'/profile/edit'}
            className="absolute size-14 left-0 rounded-full opacity-0 group-hover:opacity-100 transition-all right-0 cursor-pointer  bottom-0 top-0 bg-zinc-900/70 flex items-center justify-center"
          >
            <Pen className="size-7 text-white" weight="fill" />
          </Link>
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-bold">{user?.email}</p>
          <span className="text-sm text-muted-foreground">{user?.name}</span>
        </div>
      </div>

      {!lgMediaMobile && (
        <Image
          width={597}
          height={534}
          src={'/images/Delivery.svg'}
          alt="image-auth"
          className="mx-auto"
        />
      )}

      {lgMediaMobile && (
        <div className="py-24 w-full">
          <ListFriends />
        </div>
      )}
    </main>
  )
}
