import { Button } from '@/components/ui/button'
import { useSocket } from '@/context/users-socket'
import { querryClient } from '@/lib/react-querry'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send } from 'lucide-react'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { createMessageChat } from '@/api/messages-chat/create-messages-chat'
import { Textarea } from '@/components/ui/textarea'
import { ListChatType } from './chat'
import { useAuth } from '@/context/auth-context'

const sendMessageSchema = z.object({
  message: z.string().min(1),
})

type SendMessage = z.infer<typeof sendMessageSchema>

interface SendMessageProps {
  chatId: string
}
export function SendMessage({ chatId }: SendMessageProps) {
  const { friendId } = useParams<{ friendId: string }>()
  const { sendMessage, newMessages } = useSocket()
  const { user } = useAuth()
  const { register, handleSubmit, reset } = useForm<SendMessage>({
    resolver: zodResolver(sendMessageSchema),
  })

  const createNewMessageMutation = useMutation({
    mutationFn: createMessageChat,
    onSuccess: (_, { chatId, message }) => {
      sendMessage({
        nameUser: user?.name as string,
        message,
        recipientId: friendId,
        chatId,
      })

      querryClient.invalidateQueries({
        queryKey: ['/list-chat', friendId],
      })

      reset()
    },
  })

  function handleSendMessage(data: SendMessage) {
    createNewMessageMutation.mutate({
      chatId,
      message: data.message,
    })
  }

  useEffect(() => {
    const listChat = querryClient.getQueryData([
      '/list-chat',
      friendId,
    ]) as ListChatType

    if (newMessages) {
      if (newMessages.chatId === chatId) {
        querryClient.setQueryData<ListChatType>(['/list-chat', friendId], {
          ...listChat,
          messages: [
            ...listChat.messages,
            {
              id: newMessages.id,
              userId: newMessages.userId,
              message: newMessages.message,
              createdAt: newMessages.createdAt,
            },
          ],
        })
      }
    }
  }, [chatId, friendId, newMessages])

  const { isPending } = createNewMessageMutation

  return (
    <form
      onSubmit={handleSubmit(handleSendMessage)}
      className="w-full flex py-3 bg-white border-t  items-center px-4 gap-2"
    >
      <Textarea
        className="w-full resize-none h-[50px]"
        placeholder="Enviar mensagem"
        {...register('message')}
      />
      <Button
        disabled={isPending}
        type="submit"
        className="!h-[50px]"
        variant={'default'}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </form>
  )
}
