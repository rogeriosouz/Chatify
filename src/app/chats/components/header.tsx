'use client'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/context/auth-context'
import { useSocket } from '@/context/users-socket'
import { Bell, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Header() {
  const { logout, user } = useAuth()
  const [openNotification, setOpenNotification] = useState(false)
  const { disconnectSocket, notificationNewMessage } = useSocket()

  function logoutFn() {
    disconnectSocket()
    logout()
  }
  useEffect(() => {
    if (notificationNewMessage) {
      setOpenNotification(true)
    }
  }, [notificationNewMessage])

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

      <div className="flex items-center gap-2">
        <div>
          <Popover
            open={openNotification}
            onOpenChange={(value) => setOpenNotification(value)}
          >
            <PopoverTrigger asChild>
              <Button variant={'default'} className="h-[40px]">
                <Bell className="size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              {notificationNewMessage ? (
                <>
                  {notificationNewMessage.map((newMessage, index) => (
                    <div key={index} className="w-full flex items-center gap-2">
                      <div className="min-w-10 min-h-10 rounded-full bg-primary"></div>

                      <div>
                        <h3 className="text-sm capitalize font-bold text-primary">
                          {newMessage.nameUser}
                        </h3>
                        <span className="text-xs font-normal">
                          Envio uma mensagem para você
                        </span>

                        <Link
                          href={`/chats/${newMessage.userId}`}
                          className="block text-sm font-normal hover:text-primary hover:underline"
                        >
                          Ver mensagem
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                'Nenhuma nova mensagem para você'
              )}
            </PopoverContent>
          </Popover>
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
      </div>
    </header>
  )
}
