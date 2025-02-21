'use client'
import { getFriends } from '@/api/friends/get-friends'
import { useSocket } from '@/context/users-socket'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { AddFriends } from './add-friends'
import Link from 'next/link'
import clsx from 'clsx'
import {
  friendsRequest,
  FriendsRequesType,
} from '@/api/friends/friends-request'
import { Users } from '@phosphor-icons/react'
import { AcceptFriend } from './accept-friend'
import { RefuseFriend } from './refuse-friend'
import { useCallback } from 'react'
import { User } from './user'

interface ListFriendsProps {
  isMobile?: boolean
}

export function ListFriends({ isMobile = false }: ListFriendsProps) {
  const { data, status } = useQuery<{
    friends: { id: string; name: string; chatId: string }[]
  }>({
    queryKey: ['/friends'],
    queryFn: getFriends,
  })

  const { data: dataFriendsRequest, status: statusFriendsRequest } =
    useQuery<FriendsRequesType>({
      queryKey: ['/friends-request'],
      queryFn: friendsRequest,
    })

  const { usersOnline } = useSocket()
  const { friendId } = useParams()

  const friendsOnline = useCallback(() => {
    // eslint-disable-next-line array-callback-return
    const friendsOnline = data?.friends.filter((friend) =>
      usersOnline?.includes(friend.id),
    )

    if (!friendsOnline) {
      return 0
    }

    return friendsOnline?.length
  }, [data?.friends, usersOnline])

  return (
    <div
      className={clsx('bg-secondary  h-full overflow-auto', {
        'lg:hidden border-r': !isMobile,
        'w-full': isMobile,
      })}
    >
      <User />

      <div className="p-5">
        <div className="flex items-center gap-2">
          <Users className="size-10 text-primary" weight="fill" />
          <h2 className="text-base font-bold text-primary">Amigos</h2>
          <AddFriends />
        </div>
        <span className="text-xs text-muted-foreground">
          Amigos online {friendsOnline() || 0}
        </span>
      </div>

      {status === 'pending' && (
        <div className="mb-5">
          <div className="w-full transition-all justify-between flex items-center py-2 px-5">
            <div className="flex items-center gap-2">
              <div className="size-12 rounded-full bg-zinc-900/10 animate-pulse relative"></div>
              <div className="space-y-0.5">
                <div className="w-[100px] h-2 bg-zinc-900/10 animate-pulse"></div>
                <div className="w-[50px] h-2 bg-zinc-900/10 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="w-full transition-all justify-between flex items-center py-2 px-5">
            <div className="flex items-center gap-2">
              <div className="size-12 rounded-full bg-zinc-900/10 animate-pulse relative"></div>
              <div className="space-y-0.5">
                <div className="w-[100px] h-2 bg-zinc-900/10 animate-pulse"></div>
                <div className="w-[50px] h-2 bg-zinc-900/10 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="mb-5">
          {data.friends.length <= 0 && (
            <p className="text-sm font-medium px-5 text-primary">
              !Você não possui amigos.
            </p>
          )}

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
        </div>
      )}

      {statusFriendsRequest === 'pending' && (
        <div>
          <div className="px-5 mb-2 space-y-0.5">
            <div className="w-[120px] h-2 bg-zinc-900/10 animate-pulse"></div>
            <div className="w-[50px] h-2 bg-zinc-900/10 animate-pulse"></div>
          </div>

          <div className="w-full transition-all justify-between flex items-center py-2 px-5">
            <div className="flex items-center gap-2">
              <div className="size-12 rounded-full bg-zinc-900/10 animate-pulse relative"></div>
              <div className="space-y-0.5">
                <div className="w-[100px] h-2 bg-zinc-900/10 animate-pulse"></div>
                <div className="w-[50px] h-2 bg-zinc-900/10 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {statusFriendsRequest === 'success' && (
        <div>
          {dataFriendsRequest.friendsRequest.length >= 1 && (
            <>
              <div className="px-5 mb-2">
                <h2 className="text-base font-bold text-primary">
                  Pedidos de Amizades
                </h2>
                <span className="text-xs text-muted-foreground">
                  Total de Pedidos de Amizades{' '}
                  {dataFriendsRequest.friendsRequest.length}
                </span>
              </div>

              {dataFriendsRequest?.friendsRequest.map((friend) => (
                <div
                  key={friend.id}
                  className="w-full transition-all justify-between flex items-center py-2 px-5"
                >
                  <div className="flex items-center gap-2">
                    <div className="size-12 rounded-full bg-primary relative">
                      {usersOnline?.includes(friend.friendId) && (
                        <div className="absolute top-[70%] left-[70%] size-4 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm capitalize text-primary font-bold">
                        {friend.nameFriend}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {usersOnline?.includes(friend.friendId)
                          ? 'online'
                          : 'offline'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AcceptFriend friendId={friend.friendId} />

                    <RefuseFriend friendId={friend.friendId} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
