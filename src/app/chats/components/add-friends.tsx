import { addFriends } from '@/api/friends/add-friends'
import { getUser } from '@/api/get-user'
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
import { useAuth } from '@/context/auth-context'
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
  const { user } = useAuth()
  const { usersOnline, sendRequestFriend } = useSocket()

  const nameUser = watch('nameFriend')

  const getFriendMutation = useMutation<
    { user: { id: string; name: string } },
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
      toast.success('Usuario encontrado com sucesso', {
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
    { nameFriend: string },
    unknown
  >({
    mutationFn: async ({ nameFriend }) => {
      const data = await addFriends({ nameFriend })

      return data
    },
    onSuccess: ({ message }) => {
      if (getFriendMutation.data && user) {
        sendRequestFriend({
          name: user.name,
          recipientId: getFriendMutation.data.user.id,
        })
      }

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

  function handleAddFriends() {
    if (getFriendMutation.data) {
      addFriendsMutation.mutate({
        nameFriend: getFriendMutation.data?.user.name,
      })
    }
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

  return (
    <Dialog
      open={openAddFriends}
      onOpenChange={(value) => setOpenAddFriends(value)}
    >
      <DialogTrigger asChild>
        <Button variant={'default'} size={'icon'}>
          <Plus className="size5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded bg-secondary">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl">Adicionar amigo</DialogTitle>
          <DialogDescription>
            Para adicionar amigos, coloque o nome completo dele no campo abaixo.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleGetFriend)}
          className="w-full space-y-3"
        >
          <Input
            {...register('nameFriend')}
            placeholder="Nome do usuário"
            type="text"
          />

          {status === 'success' && (
            <div className="w-full transition-all justify-between flex items-center py-5">
              <div className="flex items-center gap-2">
                <div className="size-12 rounded-full bg-primary relative">
                  {usersOnline?.includes(data?.user.id) && (
                    <div className="absolute top-[70%] left-[70%] size-4 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm capitalize text-primary font-bold">
                    {data?.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {usersOnline?.includes(data?.user.id)
                      ? 'online'
                      : 'offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleAddFriends} type="button" size={'icon'}>
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
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
            Pesquisar amigo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
