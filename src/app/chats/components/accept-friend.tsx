import { acceptFriend } from '@/api/friends/accept-friend'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useSocket } from '@/context/users-socket'
import { querryClient } from '@/lib/react-querry'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface AcceptFriendProps {
  friendId: string
}

export function AcceptFriend({ friendId }: AcceptFriendProps) {
  const { sendAcceptedFriend } = useSocket()
  const { user } = useAuth()
  const acceptFriendMutation = useMutation<
    { message: string },
    { response: { data: { message: string } } },
    { friendId: string },
    unknown
  >({
    mutationFn: async ({ friendId }) => {
      const data = await acceptFriend({
        friendId,
      })

      return data
    },
    onSuccess: ({ message }, { friendId }) => {
      if (user) {
        sendAcceptedFriend({
          recipientId: friendId,
          name: user.name,
        })
      }

      querryClient.invalidateQueries({
        queryKey: ['/friends-request'],
        type: 'all',
      })
      querryClient.invalidateQueries({
        queryKey: ['/friends'],
        type: 'all',
      })

      toast.success(message, {
        className: '!w-[400px] !h-[70px] !bg-green-500 !text-black',
      })
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    },
  })

  function handleAcceptFriend() {
    acceptFriendMutation.mutate({
      friendId,
    })
  }

  const { isPending } = acceptFriendMutation

  return (
    <Button disabled={isPending} onClick={handleAcceptFriend} size={'icon'}>
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Plus className="size-4" />
      )}
    </Button>
  )
}
