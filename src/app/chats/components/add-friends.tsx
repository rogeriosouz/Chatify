import { addFriends } from '@/api/friends/add-friends'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
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
  } = useForm<AddFriendsRequest>({
    resolver: zodResolver(schemaAddFriends),
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

  function handleAddFriends({ nameFriend }: AddFriendsRequest) {
    addFriendsMutation.mutate({ nameFriend })
  }

  const { isPending } = addFriendsMutation

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
          onSubmit={handleSubmit(handleAddFriends)}
          className="w-full space-y-3"
        >
          <label className="block">
            <Input
              {...register('nameFriend')}
              placeholder="Nome do usuário"
              type="text"
            />

            {errors.nameFriend && (
              <span className="text-red-600 text-sm">
                {errors.nameFriend.message}
              </span>
            )}
          </label>

          <Button disabled={isPending} size={'default'} className="w-full">
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Enviar solicitação de amizade.
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
