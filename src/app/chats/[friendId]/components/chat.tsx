'use client'
import { listChat } from '@/api/chat/list-chat'
import { useAuth } from '@/context/auth-context'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { SendMessage } from './send-message'
import { HeaderChat } from './header-chat'
import clsx from 'clsx'

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

export function Chat() {
  const { friendId } = useParams<{ friendId: string }>()
  const { user } = useAuth()
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
    }, 100)

    return () => clearTimeout(timeout)
  }, [data?.messages])

  return (
    <>
      {status === 'success' && (
        <div className="h-[585px]">
          <HeaderChat userName={data?.friend.name} />

          <div className="w-full h-full flex flex-col">
            <div className="space-y-20 flex-1 p-10 scroll-smooths overflow-auto">
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
                      <div className="min-w-12 min-h-12 rounded-full bg-primary"></div>
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
                      <div className="min-w-12 min-h-12 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <SendMessage chatId={data.chatId} />
          </div>
        </div>
      )}
    </>
  )
}
