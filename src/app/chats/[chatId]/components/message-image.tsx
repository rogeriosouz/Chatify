import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/context/auth-context'
import { Message } from '@/context/chat-context'
import { CheckStringType } from '@/utils/check-string-message-chat'
import { downloadFile } from '@/utils/download-file'
import { formatDate } from '@/utils/format-date'
import { DownloadSimple, X } from '@phosphor-icons/react'
import clsx from 'clsx'
import Image from 'next/image'

interface MessageImageProps {
  message: Message
}

export function MessageImage({ message }: MessageImageProps) {
  const { user } = useAuth()

  const urlImage = message.urlDocumentOrImage as string

  return (
    <div
      className={clsx('w-full flex items-center', {
        'justify-end': message.userId === user?.id,
      })}
    >
      <div className="max-w-[350px] space-y-[-10px]">
        <Dialog>
          <DialogTrigger className="relative">
            <div
              className={clsx(
                'absolute z-[-1] top-0 w-0 rotate-180 h-0 border-[17px] border-t-transparent border-b-secondary border-l-transparent border-r-transparent',
                {
                  'right-[-8px]': message.userId === user?.id,
                  'left-[-8px]': message.userId !== user?.id,
                },
              )}
            ></div>
            <div className="relative overflow-hidden rounded transition-all">
              <Image
                className="object-contain hover:scale-110 transition-all"
                width={350}
                height={350}
                src={urlImage}
                alt={urlImage}
              />

              <span className="text-white bg-zinc-900/40 rounded px-5 py-2 right-0 bottom-0 text-[11px] absolute font-medium">
                {formatDate(message.createdAt)}
              </span>
            </div>
          </DialogTrigger>
          <DialogContent className="!min-w-[500px] bg-transparent border-none shadow-none">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className="relative">
              <Image
                className="object-cover relative w-full rounded"
                width={900}
                height={490}
                src={urlImage}
                alt={urlImage}
              />

              <button
                onClick={async () => {
                  await downloadFile({
                    fileUrl: urlImage,
                  })
                }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900/80  hover:opacity-70 transition-all rounded px-20 py-1 "
              >
                <DownloadSimple className="size-16 text-white" />
              </button>
            </div>
            <DialogClose asChild>
              <button className="size-5 flex items-center justify-center">
                <X className="size-5 text-white" />
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        {message.message && (
          <div className="p-2 bg-secondary rounded-b">
            <CheckStringType str={message.message} />
          </div>
        )}
      </div>
    </div>
  )
}
