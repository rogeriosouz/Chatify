import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useSocket } from '@/context/users-socket'
import { Pen } from '@phosphor-icons/react'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

export function HeaderChats() {
  const { user, logout } = useAuth()
  const { disconnectSocket } = useSocket()

  return (
    <header className="w-full hidden xl:flex py-2 px-5 items-center justify-between gap-2 absolute top-0 left-0 right-0 border-b bg-secondary">
      <div className="flex items-center gap-2">
        {!user && (
          <div className="size-14 rounded-full bg-zinc-900/10 animate-pulse"></div>
        )}

        <div className="relative size-14 group rounded-full">
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt={user?.name} />
            <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
          </Avatar>

          <Link
            href={'/profile/edit'}
            className="absolute size-14 left-0 rounded-full opacity-0 group-hover:opacity-100 transition-all right-0 cursor-pointer  bottom-0 top-0 bg-zinc-900/70 flex items-center justify-center"
          >
            <Pen className="size-7 text-white" weight="fill" />
          </Link>
        </div>

        <div className="space-y-0.5">
          <p className="text-lg font-bold capitalize">{user?.name}</p>
          <p className="text-sm font-normal text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </div>

      <Button
        onClick={() => {
          disconnectSocket()
          logout()
        }}
        variant={'outline'}
        className="flex h-[40px] items-center"
      >
        <LogOut className="size-5" />
        logout
      </Button>
    </header>
  )
}
