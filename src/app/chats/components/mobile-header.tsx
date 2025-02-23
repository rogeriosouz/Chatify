'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { LogOut } from 'lucide-react'
import { Notification } from './notification'
import { FriendCardChat } from './friend-card-chat'
import { useMediaQuery } from 'usehooks-ts'

export function MobileHeader() {
  const { logout } = useAuth()
  const lgMediaMobile = useMediaQuery('(max-width: 1023px)')
  return (
    <div className="hidden lg:flex items-center justify-between border-b py-2 px-4">
      <FriendCardChat />

      <div className="flex items-center gap-2">
        {lgMediaMobile && <Notification />}

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
