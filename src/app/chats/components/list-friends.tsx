import { getFriends } from '@/api/friends/get-friends'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { SearchFriend } from './search-friend'
import { useSocket } from '@/context/users-socket'
import clsx from 'clsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ListFriends() {
  const { usersOnline } = useSocket()
  const { chatId } = useParams()

  const searchParams = useSearchParams()
  const search = searchParams.get('search')

  const { data, status } = useQuery<{
    friends: { id: string; name: string; imageUrl: string; chatId: string }[]
  }>({
    queryKey: ['/friends', search],
    queryFn: async () => {
      const data = await getFriends(search ? { search } : {})

      return data
    },
    placeholderData: (prev) => prev,
  })

  return (
    <>
      {status === 'success' && (
        <div className="w-full">
          <SearchFriend />

          {data.friends.length <= 0 && (
            <p className="text-sm font-medium px-5  text-primary">
              Friends not found.
            </p>
          )}

          <div className="w-full px-5 mt-5">
            {data?.friends.map((friend) => (
              <Link
                key={friend.id}
                href={`/chats/${friend.chatId}`}
                className={clsx(
                  'w-full  transition-all hover:bg-primary/20 shadow-xl rounded-md  flex items-center gap-2 py-2 px-5',
                  {
                    'bg-primary/20': chatId ? friend.chatId === chatId : false,
                    'bg-white': chatId ? friend.chatId !== chatId : false,
                  },
                )}
              >
                <div className="size-12 rounded-full bg-primary relative">
                  <Avatar>
                    <AvatarImage src={friend.imageUrl} alt={friend.name} />
                    <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
                  </Avatar>

                  {usersOnline?.includes(friend.id) && (
                    <div className="absolute top-[70%] left-[70%] size-4 bg-green-500 rounded-full"></div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <p className="text-base transition-all text-primary capitalize font-bold">
                    {friend.name}
                  </p>
                  <p className="text-xs text-muted-foreground transition-all  capitalize font-normal">
                    {usersOnline?.includes(friend.id) ? 'online' : 'offline'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
