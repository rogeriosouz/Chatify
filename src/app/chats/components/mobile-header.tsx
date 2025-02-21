'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { LogOut } from 'lucide-react'
import { Notification } from './notification'
import { FriendCardChat } from './friend-card-chat'

export function MobileHeader() {
  const { logout } = useAuth()

  return (
    <div className="hidden lg:flex items-center justify-between border-b py-2 px-4">
      <FriendCardChat />

      <div className="flex items-center gap-2">
        <Notification />

        <nav className="flex items-center gap-2">
          <Button
            onClick={logout}
            variant={'outline'}
            className="flex h-[40px] items-center"
          >
            <LogOut className="size-5" />
            Sair
          </Button>
        </nav>
      </div>
    </div>
  )
}
