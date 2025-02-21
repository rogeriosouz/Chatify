'use client'
import { useEffect, useRef } from 'react'
import { SendMessage } from './send-message'
import { HeaderChat } from './header-chat'
import { Message } from './message'
import { useChat } from '@/context/chat-context'
import { formatDateDay } from '@/utils/format-date-day'

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
  // h-[585px] lg:
  return (
    <>
      {statusQuerry === 'success' && data && (
        <div className="h-full w-full">
          <HeaderChat userName={data.friend.name} />

          <div className="w-full h-[92vh] flex flex-col">
            <div className="space-y-6 flex-grow p-10 lg:px-4 scroll-smooths overflow-auto">
              {data.messages.map((message, index) => (
                <div
                  key={index}
                  ref={
                    index === data.messages.length - 1 ? lastMessageRef : null
                  }
                >
                  {(index === 0 ||
                    new Date(message.createdAt).getDay() !==
                      new Date(
                        data.messages[index - 1].createdAt,
                      ).getDay()) && (
                    <div className="flex items-center my-10 justify-center">
                      <span className="text-sm bg-secondary rounded px-4 py-0.5 font-normal">
                        {formatDateDay(message.createdAt)}
                      </span>
                    </div>
                  )}

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
