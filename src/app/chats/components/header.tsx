'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useSocket } from '@/context/users-socket'
import { LogOut } from 'lucide-react'

export function Header() {
  const { logout, user } = useAuth()
  const { disconnectSocket } = useSocket()

  function logoutFn() {
    disconnectSocket()
    logout()
  }

  return (
    <header className="w-full bg-secondary h-[8vh] flex items-center justify-between px-40 xl:px-5">
      <div className="flex items-center gap-2">
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
    </header>
  )
}
