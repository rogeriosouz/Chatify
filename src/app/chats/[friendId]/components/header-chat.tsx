import { useSocket } from '@/context/users-socket'
import { useParams } from 'next/navigation'

interface HeaderChatPops {
  userName: string
}

export function HeaderChat({ userName }: HeaderChatPops) {
  const { friendId } = useParams<{ friendId: string }>()
  const { usersOnline } = useSocket()

  return (
    <div className="w-full py-2 px-4 justify-between bg-neutral-100/50 flex items-center">
      <div className="flex items-center gap-2">
        <div className="size-12 rounded-full bg-primary"></div>
        <div className="space-y-0.5">
          <p className="text-base capitalize text-primary font-bold">
            {userName}
          </p>
          <p className="text-xs text-muted-foreground">
            {usersOnline?.includes(friendId) ? 'online' : 'offline'}
          </p>
        </div>
      </div>
    </div>
  )
}
