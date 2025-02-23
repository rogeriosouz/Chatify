import { useAuth } from '@/context/auth-context'
import { CheckStringType } from '@/utils/check-string-message-chat'
import { formatDate } from '@/utils/format-date'
import clsx from 'clsx'
import Image from 'next/image'

interface MessageProps {
  userId: string
  message: string | null | undefined
  createdAt: string
  isImage: string | null | undefined
  imageUrl: string | null | undefined
}

export function Message({
  userId,
  message,
  isImage,
  imageUrl,
  createdAt,
}: MessageProps) {
  const { user } = useAuth()

  return (
    <div
      className={clsx('flex items-center gap-1', {
        'justify-end ': userId === user?.id,
      })}
    >
      <div
        className={clsx(' relative  bg-secondary rounded', {
          'p-0': isImage,
          'pl-3 pr-10 py-2': !isImage,
        })}
      >
        {isImage && imageUrl && (
          <div className="relative">
            {!isImage && (
              <span className="text-white bg-zinc-900/50s px-3 py-2 right-0 bottom-0 text-[11px] absolute font-medium ">
                {formatDate(createdAt)}
              </span>
            )}
            <Image
              className="object-contain rounded"
              width={350}
              height={400}
              src={imageUrl}
              alt={imageUrl}
            />
          </div>
        )}

        <div
          className={clsx('', {
            'p-2': message && isImage,
          })}
        >
          {message && <CheckStringType str={message} />}
        </div>

        {userId === user?.id && (
          <div className="absolute  z-[-1] right-[-8px] top-0 w-0 rotate-180 h-0 border-[17px] border-t-transparent border-b-secondary border-l-transparent border-r-transparent"></div>
        )}

        {message && isImage && (
          <span className="text-muted-foreground pl-0.5 right-2 bottom-1 text-[11px] absolute font-medium">
            {formatDate(createdAt)}
          </span>
        )}

        <span
          className={clsx('text-[11px] absolute font-medium', {
            'text-white px-3 py-2 right-2 bottom-2': isImage && !message,
            'text-muted-foreground pl-0.5 right-1 bottom-1': !isImage,
            invisible: isImage && message,
          })}
        >
          {formatDate(createdAt)}
        </span>

        {userId !== user?.id && (
          <div className="absolute z-[-1] left-[-8px] top-0 w-0 rotate-180 h-0 border-[17px] border-t-transparent border-b-secondary border-l-transparent border-r-transparent"></div>
        )}
      </div>
    </div>
  )
}
