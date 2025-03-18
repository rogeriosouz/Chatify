'use client'
import { getFriends } from '@/api/friends/get-friends'
import { useSocket } from '@/context/users-socket'
import { useQuery } from '@tanstack/react-query'
import { AddFriends } from './add-friends'
import {
  friendsRequest,
  FriendsRequesType,
} from '@/api/friends/friends-request'
import { AcceptFriend } from './accept-friend'
import { RefuseFriend } from './refuse-friend'
import { useCallback } from 'react'
import { User } from './user'
import { ListFriends } from './list-friends'
import clsx from 'clsx'
import Image from 'next/image'

interface FriendsProps {
  isMobile?: boolean
}

export function Friends({ isMobile = false }: FriendsProps) {
  const { usersOnline } = useSocket()

  const { data, status } = useQuery<{
    friends: { id: string; name: string; imageUrl: string; chatId: string }[]
  }>({
    queryKey: ['/friends'],
    queryFn: async () => {
      const data = await getFriends({})

      return data
    },
  })

  const { data: dataFriendsRequest, status: statusFriendsRequest } =
    useQuery<FriendsRequesType>({
      queryKey: ['/friends-request'],
      queryFn: friendsRequest,
    })

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
      className={clsx('bg-secondary h-full overflow-auto', {
        'lg:hidden border-r': !isMobile,
        'w-full': isMobile,
      })}
    >
      <User />

      <div className="p-5 mt-10">
        <div className="w--full justify-between flex items-center gap-2">
          <h2 className="text-3xl font-bold text-primary">Friends</h2>
          <AddFriends />
        </div>
        <span className="text-xs text-muted-foreground">
          Friends online {friendsOnline() || 0}
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

      <ListFriends />

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
              <div className="px-5 mb-2 mt-5">
                <h2 className="text-base font-bold text-primary">
                  Friends request
                </h2>
                <span className="text-xs text-muted-foreground">
                  Total Friend Requests{' '}
                  {dataFriendsRequest.friendsRequest.length}
                </span>
              </div>

              {dataFriendsRequest?.friendsRequest.map((friend) => (
                <div
                  key={friend.id}
                  className="w-full transition-all justify-between flex items-center py-2 px-5"
                >
                  <div className="flex items-center gap-2">
                    <div className="size-12 rounded-full relative">
                      <Image
                        width={80}
                        height={80}
                        className="w-full h-full rounded-full"
                        src={friend.imageUrl as string}
                        alt={friend.nameFriend as string}
                      />

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
