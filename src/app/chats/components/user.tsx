import { useAuth } from '@/context/auth-context'
import { Notification } from './notification'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'
import { useSocket } from '@/context/users-socket'
import Image from 'next/image'
import { Pen } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export function User() {
  const { user, logout } = useAuth()
  const { disconnectSocket } = useSocket()
  const lgMediaMobile = useMediaQuery('(max-width: 1023px)')

  return (
    <div className="w-full  space-y-12 ">
      <div className="w-full h-[65px] px-4 border-b flex lg items-center justify-between gap-2">
        {!lgMediaMobile && <Notification />}

        <Button
          onClick={() => {
            logout()
            disconnectSocket()
          }}
          variant={'outline'}
          className="flex h-[40px] lg:hidden items-center"
        >
          <LogOut className="size-5" />
          Sair
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-center">
          <div className="size-20 rounded-full relative group">
            <Link
              href={'/profile/edit'}
              className="absolute left-0 rounded-full opacity-0 group-hover:opacity-100 transition-all right-0 cursor-pointer  bottom-0 top-0 bg-zinc-900/70 flex items-center justify-center"
            >
              <Pen className="size-7 text-white" weight="fill" />
            </Link>

            {!user && (
              <div className="size-20 rounded-full bg-zinc-900/10 animate-pulse"></div>
            )}

            {user && (
              <Image
                width={80}
                height={80}
                src={user.imageUrl}
                alt={user.name}
                className="rounded-full object-cover"
              />
            )}

            <div className="absolute top-[75%] left-[75%] size-5 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <h3 className="text-lg text-primary text-center font-semibold capitalize">
          {user?.name}
        </h3>
      </div>
    </div>
  )
}
