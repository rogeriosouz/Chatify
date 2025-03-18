import { File, FileCode, Pencil } from '@phosphor-icons/react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Send } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useSocket } from '@/context/users-socket'
import { useAuth } from '@/context/auth-context'
import { useChat } from '@/context/chat-context'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { querryClient } from '@/lib/react-querry'
import { createNewMessageWithImageDocument } from '@/api/messages-chat/create-new-message-with-image-document'
import { upload } from '@/api/upload'

const schemaSendDocument = z.object({
  message: z.string().optional(),
})

type SendDocument = z.infer<typeof schemaSendDocument>

export function SendDocument() {
  const [openSendDocument, setOpenSendDocument] = useState(false)
  const { sendMessage } = useSocket()
  const { user } = useAuth()
  const { chatId } = useParams<{ chatId: string }>()
  const { data, statusQuerry } = useChat()
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputEditRef = useRef<HTMLInputElement | null>(null)

  const { register, handleSubmit, reset } = useForm<SendDocument>({
    resolver: zodResolver(schemaSendDocument),
  })

  const uploadImageMutation = useMutation<
    {
      fileUrl: string
    },
    { response: { data: { message: string } } },
    { file: File; message: string | null; chatId: string },
    unknown
  >({
    mutationFn: async ({ file }) => {
      const data = await upload({ file })

      return data
    },
    onSuccess: ({ fileUrl }, { chatId, message }) => {
      setFile(null)
      sendDocumentMutation.mutate({
        chatId,
        message: message || null,
        urlDocumentOrImage: fileUrl,
      })
    },
  })

  const sendDocumentMutation = useMutation<
    {
      fileUrl: string
      messageChat: {
        id: string
        createdAt: string
      }
    },
    { response: { data: { message: string } } },
    { message: string | null; chatId: string; urlDocumentOrImage: string },
    unknown
  >({
    mutationFn: async ({ chatId, message, urlDocumentOrImage }) => {
      const data = await createNewMessageWithImageDocument({
        chatId,
        message,
        urlDocumentOrImage,
        isDocument: true,
      })

      return data
    },
    onSuccess: ({ fileUrl }, { chatId, message }) => {
      if (data && statusQuerry === 'success' && user) {
        sendMessage({
          recipientId: data.friend.id,
          isImage: null,
          isDocument: 'true',
          chatId,
          urlDocumentOrImage: fileUrl,
          message: message || '',
          nameUser: user.name,
          imageUserUrl: user.imageUrl as string,
        })

        querryClient.invalidateQueries({
          queryKey: ['/list-chat'],
          type: 'all',
        })

        setFile(null)
        setOpenSendDocument(false)
        reset()
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    },
  })

  function handleSendDocument(data: SendDocument) {
    if (!file) {
      toast.error('Error você não pode enviar sem uma imagem!', {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
      return
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'package.json',
      'node_modules',
      '.git',
      'yarn.lock',
      'pnpm-lock.yaml',
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error('Error documento inválido', {
        className: '!w-[400px] !border-none !h-[70px] !bg-red-500 !text-white',
      })
      if (inputEditRef.current) {
        inputEditRef.current.value = ''
      }
      if (inputRef.current) {
        inputRef.current.value = ''
      }

      return
    }

    uploadImageMutation.mutate({
      file,
      chatId,
      message: data.message || null,
    })
  }

  useEffect(() => {
    if (!openSendDocument) {
      if (inputRef.current) {
        inputRef.current.value = ''
      }

      if (inputEditRef.current) {
        inputEditRef.current.value = ''
      }

      setFile(null)
      reset()
    }
  }, [openSendDocument])

  const { isPending: isPendingSendDocumentMutation } = sendDocumentMutation
  const { isPending: isPendingUploadImage } = uploadImageMutation

  return (
    <>
      <Dialog
        open={openSendDocument}
        onOpenChange={(value) => setOpenSendDocument(value)}
      >
        <DialogTrigger className="hidden">Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="w-full flex items-center justify-center flex-col">
            <div className="w-full relative h-[250px] border border-dashed py-5 flex items-center justify-center">
              <label className="size-10 cursor-pointer hover:opacity-80 transition-all bg-primary flex items-center justify-center rounded-md absolute top-2 right-2">
                <Pencil
                  className="size-5 text-white mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                  weight="fill"
                />

                <Input
                  ref={inputEditRef}
                  disabled={
                    isPendingUploadImage || isPendingSendDocumentMutation
                  }
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const fileTarget = e.target.files?.[0] as File
                    setFile(fileTarget)
                  }}
                  type="file"
                  className="hidden"
                />
              </label>

              <div className="w-full h-full flex items-center justify-center">
                <File className="size-20" />
              </div>
            </div>

            <form
              onSubmit={handleSubmit(handleSendDocument)}
              className="w-full mt-5"
            >
              <div className="space-y-3">
                <label className="block space-y-0.5">
                  <Input
                    type="text"
                    placeholder="Descrição do documento"
                    className="w-full"
                    {...register('message')}
                  />
                </label>

                <Button
                  disabled={
                    isPendingUploadImage || isPendingSendDocumentMutation
                  }
                  type="submit"
                  className="w-full"
                >
                  Enviar documento{' '}
                  {isPendingUploadImage || isPendingSendDocumentMutation ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Send className="size-5" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <label
        htmlFor="input-doc"
        className="min-w-10 min-h-10 cursor-pointer hover:opacity-85 transition-all flex items-center justify-center rounded-full bg-primary"
      >
        <FileCode className="min-w-5 min-h-5 text-white" weight="fill" />
      </label>

      <Input
        id="input-doc"
        disabled={isPendingUploadImage || isPendingSendDocumentMutation}
        ref={inputRef}
        accept=".pdf,.doc,.docx,.txt"
        onChange={(e) => {
          setOpenSendDocument(() => true)

          const fileTarget = e.target.files?.[0] as File
          setFile(fileTarget)
        }}
        type="file"
        className="hidden"
      />
    </>
  )
}
