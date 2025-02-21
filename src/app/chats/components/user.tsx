import { useAuth } from '@/context/auth-context'
import { Notification } from './notification'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function User() {
  const { user, logout } = useAuth()

  return (
    <div className="w-full my-12 space-y-12 px-4">
      <div className="w-full flex items-center justify-end gap-2">
        <Notification />

        <Button
          onClick={logout}
          variant={'outline'}
          className="flex h-[40px] lg:hidden items-center"
        >
          <LogOut className="size-5" />
          Sair
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-center">
          <div className="size-20 rounded-full bg-primary relative">
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
