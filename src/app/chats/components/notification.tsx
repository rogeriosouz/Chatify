'use client'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import clsx from 'clsx'
import { useSocket } from '@/context/users-socket'
import { useEffect, useState } from 'react'
import { Bell } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
      <PopoverTrigger className="h-[40px] rounded-md px-4 text-white">
        <div className="size-7 relative">
          <div className="absolute rounded-full flex items-center justify-center top-[-5px] right-0 size-4 bg-red-500 text-white">
            <span className="text-xs">
              {notificationAcceptedFriend ||
              notificationNewMessage ||
              notificationNewFriendsRequest
                ? 1
                : 0}
            </span>
          </div>

          <Bell className="size-7 text-primary" weight="fill" />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[350px] !p-0">
        {notificationAcceptedFriend && (
          <div className="w-full flex items-center gap-2 border-y p-4">
            <div className="min-w-10 rounded-full min-h-10 overflow-hidden">
              <Avatar>
                <AvatarImage
                  src={notificationAcceptedFriend.imageUserUrl}
                  alt={notificationAcceptedFriend.nameUser}
                />
                <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h3 className="text-sm capitalize font-bold text-primary">
                {notificationAcceptedFriend.nameUser}
              </h3>
              <span className="text-xs font-normal">
                Accepted your friend request, you are now friends
              </span>
            </div>
          </div>
        )}

        {notificationNewFriendsRequest && (
          <div className="w-full flex items-center gap-2 border-y p-4 ">
            <div className="min-w-10 rounded-full min-h-10 overflow-hidden">
              <Avatar>
                <AvatarImage
                  src={notificationNewFriendsRequest.imageUserUrl}
                  alt={notificationNewFriendsRequest.nameUser}
                />
                <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h3 className="text-sm capitalize font-bold text-primary">
                {notificationNewFriendsRequest.nameUser}
              </h3>
              <span className="text-xs font-normal">
                He asked for your friendship
              </span>
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
                <div className="min-w-10 rounded-full min-h-10 overflow-hidden">
                  <Avatar>
                    <AvatarImage
                      src={newMessage.imageUserUrl}
                      alt={newMessage.nameUser}
                    />
                    <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <h3 className="text-sm capitalize font-bold text-primary">
                    {newMessage.nameUser}
                  </h3>
                  <span className="text-xs font-normal">
                    {newMessage.isImage
                      ? 'I send you an image'
                      : 'I send you a message'}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {!notificationNewFriendsRequest &&
          !notificationNewMessage &&
          !notificationAcceptedFriend && (
            // eslint-disable-next-line react/no-unescaped-entities
            <p className="p-5">You don't have any messages!</p>
          )}
      </PopoverContent>
    </Popover>
  )
}
