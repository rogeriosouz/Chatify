'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useSocket } from '@/context/users-socket'
import { LogOut } from 'lucide-react'

export function Header() {
  const { logout } = useAuth()
  const { disconnectSocket } = useSocket()

  function logoutFn() {
    disconnectSocket()
    logout()
  }

  return (
    <header className="w-full bg-secondary h-[8vh] flex items-center justify-between px-40 xl:px-5">
      <div className="text-2xl font-black">LOGO</div>

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
