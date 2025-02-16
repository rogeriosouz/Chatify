'use client'
import { getFriends } from '@/api/friends/get-friends'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useSocket } from '@/context/users-socket'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export function ListFriends() {
  const { data, status } = useQuery<{
    friends: { id: string; name: string; chatId: string }[]
  }>({
    queryKey: ['/friends'],
    queryFn: getFriends,
  })

  const { usersOnline } = useSocket()
  const { user } = useAuth()
  const { friendId } = useParams()

  return (
    <div className="bg-secondary border-r">
      <div className="p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-primary">Amigos</h2>
          <Button variant={'default'} size={'icon'}>
            <Plus className="size5" />
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">
          Amigos online{' '}
          {usersOnline?.filter((usersOnline) => usersOnline !== user?.id)
            ? usersOnline?.filter((usersOnline) => usersOnline !== user?.id)
                .length
            : 0}
        </span>
      </div>

      {status === 'success' && (
        <>
          {data?.friends.map((friend) => (
            <Link
              key={friend.id}
              href={`/chats/${friend.id}`}
              className={clsx(
                'w-full hover:bg-neutral-300 transition-all  flex items-center gap-2 py-2 px-5',
                {
                  'bg-neutral-200': friendId === friend.id,
                },
              )}
            >
              <div className="size-12 rounded-full bg-primary relative">
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
        </>
      )}
    </div>
  )
}
