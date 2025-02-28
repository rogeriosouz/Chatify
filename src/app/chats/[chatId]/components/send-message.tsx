import { Button } from '@/components/ui/button'
import { useSocket } from '@/context/users-socket'
import { querryClient } from '@/lib/react-querry'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { createMessageChat } from '@/api/messages-chat/create-messages-chat'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/auth-context'
import { ListChatType, useChat } from '@/context/chat-context'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { SendImage } from './send-image'
import { SendDocument } from './send-document'

const sendMessageSchema = z.object({
  message: z.string().min(1),
})

type SendMessage = z.infer<typeof sendMessageSchema>

export function SendMessage() {
  const { chatId } = useParams<{ chatId: string }>()
  const { sendMessage, newMessages } = useSocket()
  const { user } = useAuth()
  const { register, handleSubmit, reset } = useForm<SendMessage>({
    resolver: zodResolver(sendMessageSchema),
  })
  const { data, statusQuerry } = useChat()

  const createNewMessageMutation = useMutation({
    mutationFn: createMessageChat,
    onSuccess: (_, { chatId, message }) => {
      if (data && statusQuerry === 'success') {
        sendMessage({
          recipientId: data.friend.id,
          nameUser: user?.name as string,
          message,
          chatId,
          urlDocumentOrImage: null,
          isDocument: null,
          isImage: null,
        })
      }

      querryClient.invalidateQueries({
        queryKey: ['/list-chat', chatId],
        type: 'all',
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
      chatId,
    ]) as ListChatType

    if (newMessages) {
      if (newMessages.chatId === chatId) {
        querryClient.setQueryData<ListChatType>(['/list-chat', chatId], {
          ...listChat,
          messages: [
            ...listChat.messages,
            {
              id: newMessages.id,
              userId: newMessages.userId,
              message: newMessages.message,
              createdAt: newMessages.createdAt,
              isImage: newMessages.isImage ? newMessages.isImage : null,
              isDocument: newMessages.isDocument
                ? newMessages.isDocument
                : null,
              urlDocumentOrImage: newMessages.urlDocumentOrImage
                ? newMessages.urlDocumentOrImage
                : null,
            },
          ],
        })
      }
    }
  }, [chatId, newMessages])

  const { isPending } = createNewMessageMutation

  return (
    <div className="w-full flex border-t items-center gap-2 py-3 px-10 lg:px-4">
      <SendDocument />
      <SendImage />

      <form
        onSubmit={handleSubmit(handleSendMessage)}
        className="w-full flex items-center gap-2"
      >
        <Textarea
          className="w-full resize-none pt-3 h-[50px]"
          placeholder="Enviar mensagem"
          disabled={statusQuerry === 'pending'}
          {...register('message')}
        />

        <Button
          disabled={isPending || statusQuerry === 'pending'}
          type="submit"
          variant={'default'}
        >
          Enviar
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <PaperPlaneRight className="size-4" weight="fill" />
          )}
        </Button>
      </form>
    </div>
  )
}
