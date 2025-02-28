import { useChat } from '@/context/chat-context'
import { Message } from './message'
import { formatDateDay } from '@/utils/format-date-day'
import { useEffect, useRef } from 'react'
import { MessageImage } from './message-image'
import { MessageDocument } from './message-document'

export function ListMessages() {
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
      {statusQuerry === 'pending' && (
        <div className="w-full h-screen space-y-6 flex-grow p-10 lg:px-4 scroll-smooths overflow-auto">
          <div className="w-[100px] rounded h-7 bg-zinc-900/10 animate-pulse"></div>
          <div className="w-full  flex items-center justify-end">
            <div className="w-[100px] rounded h-7 bg-zinc-900/10 animate-pulse"></div>
          </div>
          <div className="w-[100px] rounded h-7 bg-zinc-900/10 animate-pulse"></div>
          <div className="w-full  flex items-center justify-end">
            <div className="w-[100px] rounded h-7 bg-zinc-900/10 animate-pulse"></div>
          </div>
          <div className="w-[100px] rounded h-7 bg-zinc-900/10 animate-pulse"></div>
          <div className="w-full  flex items-center justify-end">
            <div className="w-[100px] rounded h-7 bg-zinc-900/10 animate-pulse"></div>
          </div>
          <div className="w-[100px] rounded h-7 bg-zinc-900/10 animate-pulse"></div>
        </div>
      )}

      {statusQuerry === 'success' && data && (
        <div className="space-y-6 flex-grow p-10 lg:px-4 scroll-smooths overflow-y-auto overflow-x-hidden">
          {data.messages.map((message, index) => (
            <div
              key={index}
              ref={index === data.messages.length - 1 ? lastMessageRef : null}
            >
              {(index === 0 ||
                new Date(message.createdAt).getDay() !==
                  new Date(data.messages[index - 1].createdAt).getDay()) && (
                <div className="flex items-center my-10 justify-center">
                  <span className="text-sm bg-secondary rounded px-4 py-0.5 font-normal">
                    {formatDateDay(message.createdAt)}
                  </span>
                </div>
              )}

              {message.isImage && <MessageImage message={message} />}

              {message.isDocument && <MessageDocument message={message} />}

              {message.message && !message.isImage && !message.isDocument && (
                <Message message={message} />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
