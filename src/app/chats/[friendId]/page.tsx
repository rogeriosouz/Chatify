'use client'
import { listChat } from '@/api/chat/list-chat'
import { useSocket } from '@/context/users-socket'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { SendMessage } from './components/send-message'
import { useParams } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useEffect, useRef } from 'react'

export interface Message {
  id: string
  userId: string
  message: string
  createdAt: string
}

export interface ListChatType {
  chatId: string
  messages: Message[]
  friend: {
    id: string
    name: string
  }
}

function formatDate(date: string) {
  const dateDate = new Date(date)
  const dateFormat = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(dateDate)

  return dateFormat
}

export default function Chat() {
  const { friendId } = useParams<{ friendId: string }>()
  const { user } = useAuth()
  const { usersOnline } = useSocket()
  const lastMessageRef = useRef<HTMLDivElement | null>(null)

  const { data, status } = useQuery<ListChatType>({
    queryKey: ['/list-chat', friendId],
    queryFn: async () => {
      const data = await listChat({ friendId })

      return data
    },
  })

  function focusLastMessage() {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      focusLastMessage()
    }, 100) // Pequeno delay para esperar a nova mensagem ser renderizada

    return () => clearTimeout(timeout)
  }, [data?.messages])

  return (
    <div className="w-full h-full">
      {status === 'success' && (
        <div className="w-full py-2 px-4 justify-between bg-neutral-100/50 flex items-center">
          <div className="flex items-center gap-2">
            <div className="size-12 rounded-full bg-primary"></div>
            <div className="space-y-0.5">
              <p className="text-base capitalize text-primary font-bold">
                {data.friend.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {usersOnline?.includes(data.friend.id) ? 'online' : 'offline'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col h-full">
        <div className="w-full relative h-[520px] scroll-smooths overflow-auto">
          {status === 'success' && (
            <div className="space-y-20 p-10">
              {data?.messages.map((message, index) => (
                <div
                  key={index}
                  ref={
                    index === data.messages.length - 1 ? lastMessageRef : null
                  }
                >
                  <div
                    className={clsx('flex items-center gap-2', {
                      'justify-end': message.userId === user?.id,
                    })}
                  >
                    {message.userId !== user?.id && (
                      <div className="size-12 rounded-full bg-primary"></div>
                    )}

                    <div>
                      <div className="px-3 py-1 bg-secondary rounded">
                        <p>{message.message}</p>
                      </div>
                      <span className="text-[10px] font-normal pl-0.5 text-muted-foreground">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>

                    {message.userId === user?.id && (
                      <div className="size-12 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {status === 'success' && (
          <SendMessage
            chatId={data.chatId}
            focusLastMessage={focusLastMessage}
          />
        )}
      </div>
    </div>
  )
}
