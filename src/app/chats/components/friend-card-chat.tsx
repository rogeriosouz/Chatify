'use client'
import { useChat } from '@/context/chat-context'
import { useSocket } from '@/context/users-socket'
import { MobileListFriends } from './mobile-list-friends'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function FriendCardChat() {
  const { statusQuerry, data } = useChat()
  const { usersOnline } = useSocket()

  return (
    <div className="items-center gap-2 hidden lg:flex">
      <MobileListFriends />

      {statusQuerry === 'success' && data && (
        <div className="size-12 rounded-full bg-primary relative">
          <Avatar>
            <AvatarImage src={data?.friend.imageUrl} alt={data?.friend.name} />
            <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
          </Avatar>

          {usersOnline?.includes(data.friend.id) && (
            <div className="absolute top-[70%] left-[70%] size-4 bg-green-500 rounded-full"></div>
          )}
        </div>
      )}

      <div className="space-y-0.5">
        {statusQuerry === 'success' && data && (
          <div className="space-y-0.5">
            <h2 className="text-xl capitalize font-bold text-primary">
              {data.friend.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {usersOnline?.includes(data.friend.id) ? 'online' : 'offline'}
            </p>
          </div>
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
