import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useChat } from '@/context/chat-context'
import { useSocket } from '@/context/users-socket'

export function HeaderChat() {
  const { usersOnline } = useSocket()
  const { statusQuerry, data } = useChat()

  return (
    <>
      {statusQuerry === 'pending' && (
        <header className="w-full py-2 lg:hidden border-b px-4 justify-between bg-neutral-100/50 flex items-center">
          <div className="flex items-center gap-2">
            <div className="size-12 rounded-full bg-zinc-900/10 animate-pulse relative"></div>
            <div className="space-y-0.5 animate-pulse">
              <div className="w-[100px] h-2 bg-zinc-900/10"></div>
              <div className="w-[50px] h-2 bg-zinc-900/10"></div>
            </div>
          </div>
        </header>
      )}

      {statusQuerry === 'success' && data && (
        <header className="w-full py-2 lg:hidden shadow-xl px-4 justify-between bg-secondary flex items-center">
          <div className="flex items-center gap-2">
            <div className="size-12 rounded-full relative">
              <Avatar>
                <AvatarImage
                  src={data.friend.imageUrl}
                  alt={data.friend.name}
                />
                <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
              </Avatar>

              {usersOnline?.includes(data.friend.id) && (
                <div className="absolute top-[70%] left-[70%] size-4 bg-green-500 rounded-full"></div>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-base capitalize text-primary font-bold">
                {data?.friend.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {usersOnline?.includes(data.friend.id) ? 'online' : 'offline'}
              </p>
            </div>
          </div>
        </header>
      )}
    </>
  )
}
