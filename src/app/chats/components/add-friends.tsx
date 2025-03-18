import { addFriends } from '@/api/friends/add-friends'
import { getUser } from '@/api/get-user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSocket } from '@/context/users-socket'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { Loader2, Plus, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schemaAddFriends = z.object({
  nameFriend: z.string().min(2),
})

type AddFriendsRequest = z.infer<typeof schemaAddFriends>

export function AddFriends() {
  const [openAddFriends, setOpenAddFriends] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AddFriendsRequest>({
    resolver: zodResolver(schemaAddFriends),
  })
  const { usersOnline, sendRequestFriend } = useSocket()

  const nameUser = watch('nameFriend')

  const getFriendMutation = useMutation<
    { users: { id: string; name: string; imageUrl: string }[] },
    { response: { data: { message: string } } },
    { nameUser: string },
    unknown
  >({
    mutationFn: async ({ nameUser }) => {
      const data = await getUser({
        nameUser,
      })

      return data
    },
    onSuccess: () => {
      toast.success('User found successfully', {
        className: '!w-[400px] !h-[70px] border-none !bg-green-500 !text-black',
      })
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        className: '!w-[400px] border-none !h-[70px] !bg-red-500 !text-white',
      })
    },
  })

  const addFriendsMutation = useMutation<
    { message: string },
    { response: { data: { message: string } } },
    { nameFriend: string; userId: string },
    unknown
  >({
    mutationFn: async ({ nameFriend }) => {
      const data = await addFriends({ nameFriend })

      return data
    },
    onSuccess: ({ message }, { nameFriend, userId }) => {
      sendRequestFriend({
        name: nameFriend,
        recipientId: userId,
      })

      toast.success(message, {
        className: '!w-[400px] !h-[70px] !bg-green-500 !text-black',
      })
      reset()

      setOpenAddFriends(false)
    },
    onError: ({ response }) => {
      toast.error(response.data.message, {
        className: '!w-[400px] border-none !h-[70px] !bg-red-500 !text-white',
      })
    },
  })

  function handleAddFriends(nameUser: string, userId: string) {
    addFriendsMutation.mutate({
      nameFriend: nameUser,
      userId,
    })
  }

  function handleGetFriend() {
    getFriendMutation.mutate({
      nameUser,
    })
  }

  const { isPending } = addFriendsMutation
  const { data, status } = getFriendMutation

  useEffect(() => {
    if (errors.nameFriend) {
      toast.error(errors.nameFriend.message, {
        className: '!w-[400px] border-none !h-[70px] !bg-red-500 !text-white',
      })
    }
  }, [errors])

  useEffect(() => {
    if (!openAddFriends) {
      reset()
      getFriendMutation.reset()
    }
  }, [openAddFriends])

  return (
    <Dialog
      open={openAddFriends}
      onOpenChange={(value) => setOpenAddFriends(value)}
    >
      <DialogTrigger asChild>
        <button className="rounded-full size-10 hover:opacity-85 transition-all bg-primary flex items-center justify-center">
          <Plus className="size-5 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-md bg-secondary">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl">Add friend</DialogTitle>
          <DialogDescription>
            To add friends, enter their full name in the field below.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleGetFriend)}
          className="w-full space-y-3"
        >
          <Input
            {...register('nameFriend')}
            placeholder="Username"
            type="text"
          />

          {status === 'success' && (
            <div className="w-full transition-all justify-between flex items-center py-5">
              {data &&
                data.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between w-full bg-primary/10 p-3 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={user.imageUrl} alt={user.name} />
                        <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
                      </Avatar>

                      <div className="space-y-0.5">
                        <p className="text-sm capitalize font-bold">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {usersOnline?.includes(user.id)
                            ? 'online'
                            : 'offline'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          handleAddFriends(user.name, user.id)
                        }}
                        type="button"
                        size={'icon'}
                      >
                        {isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Send className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <Button
            type="submit"
            size={'default'}
            disabled={!nameUser}
            className="w-full"
          >
            {status === 'pending' && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Search friend
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
