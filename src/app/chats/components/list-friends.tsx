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
import { AcceptFriend } from './accept-friend'
import { RefuseFriend } from './refuse-friend'

export function ListFriends() {
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
  // const { user } = useAuth()
  const { friendId } = useParams()

  function friendsOnline() {
    // eslint-disable-next-line array-callback-return
    const friendsOnline = data?.friends.map((friend) => {
      if (usersOnline?.includes(friend.id)) {
        return friend
      }
    })

    return friendsOnline?.length
  }

  /* {usersOnline?.filter((usersOnline) => usersOnline !== user?.id)
            ? usersOnline?.filter((usersOnline) => usersOnline !== user?.id)
                .length
            : 0} */

  return (
    <div className="bg-secondary border-r h-[660px] overflow-auto">
      <div className="p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-primary">Amigos</h2>
          <AddFriends />
        </div>
        <span className="text-xs text-muted-foreground">
          Amigos online {friendsOnline() || 0}
        </span>
      </div>

      {status === 'success' && (
        <div className="mb-5">
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
