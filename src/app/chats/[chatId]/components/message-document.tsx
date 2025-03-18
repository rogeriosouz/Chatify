import { useAuth } from '@/context/auth-context'
import { Message } from '@/context/chat-context'
import { CheckStringType } from '@/utils/check-string-message-chat'
import { downloadFile } from '@/utils/download-file'
import { formatDate } from '@/utils/format-date'
import { File, UploadSimple } from '@phosphor-icons/react'
import clsx from 'clsx'

interface MessageDocumentProps {
  message: Message
}

export function MessageDocument({ message }: MessageDocumentProps) {
  const { user } = useAuth()
  const urlDocument = message.urlDocumentOrImage as string

  return (
    <div
      className={clsx('w-full flex items-center', {
        'justify-end': message.userId === user?.id,
      })}
    >
      <div className="w-[200px] max-w-[200px]">
        <button
          onClick={() => downloadFile({ fileUrl: urlDocument })}
          className="w-full relative group border-b bg-secondary h-[110px] rounded-md flex items-center justify-center"
        >
          <File className="size-10 text-primary" weight="fill" />

          <div className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-900/70 rounded-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
            <UploadSimple className="size-8 text-white" />
          </div>

          <div
            className={clsx(
              'absolute z-[-1] top-0 w-0 rotate-180 h-0 border-[17px] border-t-transparent border-b-secondary border-l-transparent border-r-transparent',
              {
                'right-[-8px]': message.userId === user?.id,
                'left-[-8px]': message.userId !== user?.id,
              },
            )}
          ></div>

          <div className="absolute bg-zinc-900/40 rounded-md px-2 py-1  bottom-0 right-0">
            <p className="text-[11px] font-medium text-white">
              {formatDate(message.createdAt)}
            </p>
          </div>
        </button>

        {message.message && (
          <div className="p-2 bg-secondary rounded-md-b">
            <CheckStringType str={message.message} />
          </div>
        )}
      </div>
    </div>
  )
}
