import { refuseFriend } from '@/api/friends/refuse-friend'
import { Button } from '@/components/ui/button'
import { querryClient } from '@/lib/react-querry'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Minus } from 'lucide-react'
import { toast } from 'sonner'

interface RefuseFriendProps {
  friendId: string
}

export function RefuseFriend({ friendId }: RefuseFriendProps) {
  const refuseFriendMutation = useMutation<
    { message: string },
    { response: { data: { message: string } } },
    { friendId: string },
    unknown
  >({
    mutationFn: async ({ friendId }) => {
      const data = await refuseFriend({
        friendId,
      })

      return data
    },
    onSuccess: ({ message }) => {
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

  function handleRefuseFriend() {
    refuseFriendMutation.mutate({
      friendId,
    })
  }

  const { isPending } = refuseFriendMutation

  return (
    <Button
      variant={'destructive'}
      disabled={isPending}
      onClick={handleRefuseFriend}
      size={'icon'}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Minus className="size-4" />
      )}
    </Button>
  )
}
