'use client'
import { HeaderChats } from './header-chats'
import { Users } from '@phosphor-icons/react'
import { ListFriends } from './list-friends'
import { useQuery } from '@tanstack/react-query'
import { getFriends } from '@/api/friends/get-friends'
import { useMediaQuery } from 'usehooks-ts'
import { useSocket } from '@/context/users-socket'
import { useCallback } from 'react'
import { AddFriends } from './add-friends'
import Image from 'next/image'

export function ChatsContainer() {
  const { usersOnline } = useSocket()
  const lgMediaMobile = useMediaQuery('(max-width: 1023px)', {
    defaultValue: false,
    initializeWithValue: false,
  })

  const { data } = useQuery<{
    friends: { id: string; name: string; imageUrl: string; chatId: string }[]
  }>({
    queryKey: ['/friends'],
    queryFn: async () => {
      const data = await getFriends({})

      return data
    },
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
    <div className="w-full xl:flex-col relative flex items-center">
      <HeaderChats />

      {!lgMediaMobile && (
        <Image
          width={597}
          height={534}
          src={'/images/Delivery.svg'}
          alt="image-auth"
          className="mx-auto lg:mt-32"
        />
      )}

      {lgMediaMobile && (
        <main className="py-24 w-full">
          <div className="p-5">
            <div className="flex items-center gap-2">
              <Users className="size-10 text-primary" weight="fill" />
              <h2 className="text-base font-bold text-primary">Friends</h2>
              <AddFriends />
            </div>
            <span className="text-xs text-muted-foreground">
              Friends online {friendsOnline() || 0}
            </span>
          </div>

          <ListFriends />
        </main>
      )}
    </div>
  )
}
