import { getFriends } from '@/api/friends/get-friends'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SearchFriend } from './search-friend'
import { useSocket } from '@/context/users-socket'

export function ListFriends() {
  const { usersOnline } = useSocket()
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
              Amigos não encontrado.
            </p>
          )}

          {data?.friends.map((friend) => (
            <Link
              key={friend.id}
              href={`/chats/${friend.chatId}`}
              className="w-full hover:bg-neutral-300 transition-all flex items-center gap-2 py-2 px-5"
            >
              <div className="size-12 rounded-full bg-primary relative">
                <Image
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-full"
                  src={friend.imageUrl}
                  alt={friend.name}
                />
                {usersOnline?.includes(friend.id) && (
                  <div className="absolute top-[70%] left-[70%] size-4 bg-green-500 rounded-full"></div>
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm capitalize text-primary font-bold">
                  {friend.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {usersOnline?.includes(friend.id) ? 'online' : 'offline'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
