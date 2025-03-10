import { useChat } from '@/context/chat-context'
import { useSocket } from '@/context/users-socket'
import { MobileListFriends } from './mobile-list-friends'
import Image from 'next/image'

export function FriendCardChat() {
  const { statusQuerry, data } = useChat()
  const { usersOnline } = useSocket()

  return (
    <div className="items-center gap-2 hidden lg:flex">
      <MobileListFriends />

      {statusQuerry === 'success' && data && (
        <div className="size-12 rounded-full bg-primary relative">
          <Image
            width={48}
            height={48}
            src={data?.friend.imageUrl}
            alt={data?.friend.name}
            className="rounded-full"
          />

          <div className="absolute top-[70%] left-[70%] size-4 bg-green-500 rounded-full"></div>
        </div>
      )}

      <div className="space-y-0.5">
        {statusQuerry === 'success' && data && (
          <h2 className="text-xl capitalize font-bold text-primary">
            {data.friend.name}
          </h2>
        )}

        {statusQuerry === 'success' && data && (
          <p className="text-xs text-muted-foreground">
            {usersOnline?.includes(data.friend.id)}
          </p>
        )}
      </div>
    </div>
  )
}
