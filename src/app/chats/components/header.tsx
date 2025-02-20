'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useSocket } from '@/context/users-socket'
import { LogOut } from 'lucide-react'
import { Notification } from './notification'
import { FriendCardChat } from './friend-card-chat'

export function Header() {
  const { logout, user } = useAuth()

  const { disconnectSocket } = useSocket()

  function logoutFn() {
    disconnectSocket()
    logout()
  }

  return (
    <header className="w-full bg-secondary lg:h-[8vh] lg:py-0 py-4 flex items-center justify-between px-40 xl:px-5">
      <FriendCardChat />

      <div className="flex items-center gap-2 lg:hidden">
        <div className="size-12 rounded-full bg-primary relative">
          <div className="absolute top-[70%] left-[70%] size-4 bg-green-500 rounded-full"></div>
        </div>

        <div className="space-y-0.5">
          <h2 className="text-xl capitalize font-bold text-primary">
            {user?.name}
          </h2>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Notification />

        <nav className="flex items-center gap-2">
          <Button
            onClick={logoutFn}
            variant={'outline'}
            className="flex h-[40px] items-center"
          >
            <LogOut className="size-5" />
            Sair
          </Button>
        </nav>
      </div>
    </header>
  )
}
