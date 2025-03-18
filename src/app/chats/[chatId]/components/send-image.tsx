import { Images, Pencil } from '@phosphor-icons/react'

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
import Image from 'next/image'
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

const schemaSendImage = z.object({
  message: z.string().optional(),
})

type SendImage = z.infer<typeof schemaSendImage>

export function SendImage() {
  const [openSendImage, setOpenSendImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { sendMessage } = useSocket()
  const { user } = useAuth()
  const { chatId } = useParams<{ chatId: string }>()
  const { data, statusQuerry } = useChat()
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputEditRef = useRef<HTMLInputElement | null>(null)

  const { register, handleSubmit, reset } = useForm<SendImage>({
    resolver: zodResolver(schemaSendImage),
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
      sendImageMutation.mutate({
        chatId,
        message: message || null,
        urlDocumentOrImage: fileUrl,
      })
    },
  })

  const sendImageMutation = useMutation<
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
    mutationFn: async ({ urlDocumentOrImage, chatId, message }) => {
      const data = await createNewMessageWithImageDocument({
        chatId,
        message,
        urlDocumentOrImage,
      })

      return data
    },
    onSuccess: ({ fileUrl }, { chatId, message }) => {
      if (data && statusQuerry === 'success' && user) {
        sendMessage({
          recipientId: data.friend.id,
          isImage: 'true',
          isDocument: null,
          urlDocumentOrImage: fileUrl,
          chatId,
          message: message || '',
          nameUser: user.name,
          imageUserUrl: user.imageUrl,
        })

        querryClient.invalidateQueries({
          queryKey: ['/list-chat'],
          type: 'all',
        })

        setFile(null)
        setOpenSendImage(false)
        reset()
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    },
  })

  function handleSendImage(data: SendImage) {
    if (!file) {
      toast.error('Error você não pode enviar sem uma imagem!', {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Error imagem inválida', {
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
    if (!openSendImage) {
      if (inputRef.current) {
        inputRef.current.value = ''
      }

      if (inputEditRef.current) {
        inputEditRef.current.value = ''
      }

      setImagePreview(null)
      setFile(null)
      reset()
    }
  }, [openSendImage])

  const { isPending: isPendingSendImageMutation } = sendImageMutation
  const { isPending: isPendingUploadImage } = uploadImageMutation

  return (
    <>
      <Dialog
        open={openSendImage}
        onOpenChange={(value) => setOpenSendImage(value)}
      >
        <DialogTrigger className="hidden">Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="w-full flex items-center justify-center flex-col">
            {imagePreview && (
              <div className="w-full relative h-[250px] border border-dashed py-5 flex items-center justify-center">
                <label className="size-10 cursor-pointer hover:opacity-80 transition-all bg-primary flex items-center justify-center rounded-md absolute top-2 right-2">
                  <Pencil
                    className="size-5 text-white mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                    weight="fill"
                  />

                  <Input
                    ref={inputEditRef}
                    disabled={
                      isPendingUploadImage || isPendingSendImageMutation
                    }
                    accept="image/*"
                    onChange={(e) => {
                      const fileTarget = e.target.files?.[0] as File
                      setFile(fileTarget)

                      const objectUrl = URL.createObjectURL(fileTarget)
                      setImagePreview(objectUrl)
                    }}
                    type="file"
                    className="hidden"
                  />
                </label>

                <Image
                  width={220}
                  height={250}
                  src={imagePreview}
                  className="rounded-md h-full object-fill"
                  alt="image-preview"
                />
              </div>
            )}

            <form
              onSubmit={handleSubmit(handleSendImage)}
              className="w-full mt-5"
            >
              <div className="space-y-3">
                <label className="block space-y-0.5">
                  <Input
                    type="text"
                    placeholder="Descrição da imagem"
                    className="w-full"
                    {...register('message')}
                  />
                </label>

                <Button
                  disabled={isPendingUploadImage || isPendingSendImageMutation}
                  type="submit"
                  className="w-full"
                >
                  Enviar imagem{' '}
                  {isPendingUploadImage || isPendingSendImageMutation ? (
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
        htmlFor="input-image"
        className="min-w-10 min-h-10 hover:opacity-85 transition-all cursor-pointer flex items-center justify-center rounded-full bg-primary"
      >
        <Images className="size-5 text-white" weight="fill" />
      </label>

      <Input
        id="input-image"
        disabled={isPendingUploadImage || isPendingSendImageMutation}
        ref={inputRef}
        accept="image/*"
        onChange={(e) => {
          setOpenSendImage(() => true)

          const fileTarget = e.target.files?.[0] as File
          setFile(fileTarget)

          const objectUrl = URL.createObjectURL(fileTarget)
          setImagePreview(objectUrl)
        }}
        type="file"
        className="hidden"
      />
    </>
  )
}
