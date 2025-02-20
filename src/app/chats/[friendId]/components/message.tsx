import { useAuth } from '@/context/auth-context'
import { CheckStringType } from '@/utils/check-string-message-chat'
import { formatDate } from '@/utils/format-date'
import clsx from 'clsx'

interface MessageProps {
  userId: string
  message: string
  createdAt: string
}

export function Message({ userId, message, createdAt }: MessageProps) {
  const { user } = useAuth()
  return (
    <div
      className={clsx('flex items-center gap-1', {
        'justify-end': userId === user?.id,
      })}
    >
      <div className="pl-3 pr-10 relative py-2 bg-secondary rounded">
        <CheckStringType str={message} />

        {userId === user?.id && (
          <div className="absolute  z-[-1] right-[-8px] top-0 w-0 rotate-180 h-0 border-[17px] border-t-transparent border-b-secondary border-l-transparent border-r-transparent"></div>
        )}

        <span className="text-[11px] absolute right-1 bottom-1 font-medium text-muted-foreground pl-0.5">
          {formatDate(createdAt)}
        </span>

        {userId !== user?.id && (
          <div className="absolute z-[-1] left-[-8px] top-0 w-0 rotate-180 h-0 border-[17px] border-t-transparent border-b-secondary border-l-transparent border-r-transparent"></div>
        )}
      </div>
    </div>
  )
}
