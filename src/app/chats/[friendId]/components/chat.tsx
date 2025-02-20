'use client'
import { useEffect, useRef } from 'react'
import { SendMessage } from './send-message'
import { HeaderChat } from './header-chat'
import { Message } from './message'
import { useChat } from '@/context/chat-context'

export function Chat() {
  const lastMessageRef = useRef<HTMLDivElement | null>(null)
  const { statusQuerry, data } = useChat()

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
      {statusQuerry === 'success' && data && (
        <div className="h-[585px] lg:h-[92vh] w-full">
          <HeaderChat userName={data.friend.name} />

          <div className="w-full h-full flex flex-col">
            <div className="space-y-6 flex-grow p-10 lg:px-4 scroll-smooths overflow-auto">
              {data.messages.map((message, index) => (
                <div
                  key={index}
                  ref={
                    index === data.messages.length - 1 ? lastMessageRef : null
                  }
                >
                  <Message
                    message={message.message}
                    userId={message.userId}
                    createdAt={message.createdAt}
                  />
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
