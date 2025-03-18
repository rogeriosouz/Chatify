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
import { PaperPlaneTilt, Plus } from '@phosphor-icons/react'
import { SendImage } from './send-image'
import { SendDocument } from './send-document'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
          imageUserUrl: user?.imageUrl as string,
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

    if (newMessages && newMessages.chatId === chatId) {
      querryClient.setQueryData<ListChatType>(['/list-chat', chatId], {
        ...listChat,
        messages: [
          ...listChat.messages,
          {
            id: newMessages.id,
            userId: newMessages.userId,
            message: newMessages.message,
            createdAt: newMessages.createdAt,
            isImage: newMessages.isImage ?? null,
            isDocument: newMessages.isDocument ?? null,
            urlDocumentOrImage: newMessages.urlDocumentOrImage ?? null,
          },
        ],
      })
    }
  }, [chatId, newMessages])

  const { isPending } = createNewMessageMutation

  return (
    <div className="w-full flex items-center border-t  bg-white">
      <form
        onSubmit={handleSubmit(handleSendMessage)}
        className="w-full flex items-center gap-2 p-4"
      >
        <div className="border shadow-xl focus-within:ring-1 focus-within:ring-primary h-[55px] bg-white px-2.5 rounded-full w-full flex items-center gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full min-w-10 min-h-10 bg-primary flex items-center justify-center transition-all hover:opacity-85">
                <Plus className="size-5 text-white" weight="bold" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-none flex-col gap-1 shadow-none !min-w-10 max-w-10 bg-transparent flex items-center justify-center">
              <SendDocument />
              <SendImage />
            </DropdownMenuContent>
          </DropdownMenu>

          <Textarea
            className="w-full resize-none pt-3 h-[47px] bg-white !border-none !outline-none border-gray-300 focus-visible:ring-0 focus:ring-0"
            placeholder="Enter your message..."
            disabled={statusQuerry === 'pending'}
            {...register('message')}
          />

          <Button
            disabled={isPending || statusQuerry === 'pending'}
            type="submit"
            variant="default"
            className="p-4 !h-10 !w-10 shadow-xl text-white rounded-full transition-all"
            aria-label="Enviar mensagem"
          >
            {isPending ? (
              <Loader2 className="min-w-5 min-h-5  animate-spin" />
            ) : (
              <PaperPlaneTilt className="min-w-5 min-h-5" weight="fill" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
