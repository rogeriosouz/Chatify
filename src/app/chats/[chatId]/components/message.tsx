import { useAuth } from '@/context/auth-context'
import { Message as MessageType } from '@/context/chat-context'
import { CheckStringType } from '@/utils/check-string-message-chat'
import { formatDate } from '@/utils/format-date'
import clsx from 'clsx'

interface MessageProps {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  const { user } = useAuth()

  return (
    <div
      className={clsx('flex w-full items-center', {
        'justify-end': message.userId === user?.id,
      })}
    >
      <div className="relative bg-secondary rounded px-3 py-2 pr-12">
        <CheckStringType str={message.message as string} />

        <div
          className={clsx(
            'absolute z-[-1] top-0 w-0 rotate-180 h-0 border-[17px] border-t-transparent border-b-secondary border-l-transparent border-r-transparent',
            {
              'right-[-8px]': message.userId === user?.id,
              'left-[-8px]': message.userId !== user?.id,
            },
          )}
        ></div>

        <span className="text-[11px] text-muted-foreground right-2 bottom-1 absolute font-medium">
          {formatDate(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
