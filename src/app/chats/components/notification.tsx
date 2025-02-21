import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Bell, Link } from 'lucide-react'
import clsx from 'clsx'
import { useSocket } from '@/context/users-socket'
import { useEffect, useState } from 'react'

export function Notification() {
  const [openNotification, setOpenNotification] = useState(false)
  const {
    notificationAcceptedFriend,
    notificationNewMessage,
    notificationNewFriendsRequest,
  } = useSocket()

  useEffect(() => {
    if (notificationNewMessage) {
      setOpenNotification(true)
    }

    if (notificationNewFriendsRequest) {
      setOpenNotification(true)
    }

    if (notificationAcceptedFriend) {
      setOpenNotification(true)
    }
  }, [
    notificationNewMessage,
    notificationNewFriendsRequest,
    notificationAcceptedFriend,
  ])

  return (
    <Popover
      open={openNotification}
      onOpenChange={(value) => setOpenNotification(value)}
    >
      <PopoverTrigger asChild>
        <Button variant={'default'} className="h-[40px] lg:hidden">
          <Bell className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] !p-0">
        {notificationAcceptedFriend && (
          <div className="w-full flex items-center gap-2 border-y p-4">
            <div className="min-w-10 min-h-10 rounded-full bg-primary"></div>

            <div>
              <h3 className="text-sm capitalize font-bold text-primary">
                {notificationAcceptedFriend.nameUser}
              </h3>
              <span className="text-xs font-normal">
                Aceitou sua solicitação de amizade, agora vocês são amigos
              </span>
            </div>
          </div>
        )}

        {notificationNewFriendsRequest && (
          <div className="w-full flex items-center gap-2 border-y p-4 ">
            <div className="min-w-10 min-h-10 rounded-full bg-primary"></div>

            <div>
              <h3 className="text-sm capitalize font-bold text-primary">
                {notificationNewFriendsRequest.nameUser}
              </h3>
              <span className="text-xs font-normal">Te pediu em amizade</span>
            </div>
          </div>
        )}

        {notificationNewMessage && (
          <>
            {notificationNewMessage.map((newMessage, index) => (
              <div
                key={index}
                className={clsx('w-full flex items-center gap-2 p-4 ', {
                  'border-b':
                    notificationAcceptedFriend || notificationNewFriendsRequest,
                  'border-y':
                    !notificationAcceptedFriend &&
                    !notificationNewFriendsRequest,
                })}
              >
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
        )}

        {!notificationNewFriendsRequest &&
          !notificationNewMessage &&
          !notificationAcceptedFriend && (
            <p className="p-5">Você não possui Nenhuma mensagem!</p>
          )}
      </PopoverContent>
    </Popover>
  )
}
