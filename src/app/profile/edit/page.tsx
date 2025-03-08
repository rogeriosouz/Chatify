'use client'

import { updateUser as updateUserApi } from '@/api/update-user'
import { upload } from '@/api/upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { JwtResponse, useAuth } from '@/context/auth-context'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pen } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { setCookie } from 'cookies-next'
import { decode } from 'jsonwebtoken'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schemaEditProfile = z.object({
  name: z.string().min(2).optional(),
})

type EditProfile = z.infer<typeof schemaEditProfile>

export default function Edit() {
  const { user, updateUser } = useAuth()
  const [file, setFile] = useState<null | File>(null)
  const [imagePreview, setImagePreview] = useState<null | string>(null)

  const { handleSubmit, register, watch } = useForm<EditProfile>({
    resolver: zodResolver(schemaEditProfile),
    values: {
      name: user?.name,
    },
  })

  const updateUserMutation = useMutation<
    {
      token: string
      user: {
        id: string
        name: string
        email: string
        imageUrl: string
      }
    },
    { response: { data: { message: string } } },
    { name?: string; imageUrl?: string },
    unknown
  >({
    mutationFn: async ({ name, imageUrl }) => {
      const data = await updateUserApi({ name, imageUrl })

      return data
    },
    onSuccess: ({ token, user }) => {
      setFile(null)
      setImagePreview(null)

      const { exp } = decode(token) as JwtResponse
      const expirationTimestampInSeconds = exp
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000)

      const timeRemainingInSeconds =
        expirationTimestampInSeconds - currentTimestampInSeconds
      const timeRemainingInMilliseconds = timeRemainingInSeconds * 1000

      const expires = new Date(Date.now() + timeRemainingInMilliseconds)

      api.defaults.headers.authorization = `Bearer ${token}`

      setCookie('auth-token:front-token', token, {
        expires,
      })

      updateUser(user)

      toast.success('Usuario editado com sucesso', {
        className: '!w-[400px] !h-[70px] !bg-green-500 !text-black',
      })
    },
  })

  const uploadImageMutation = useMutation<
    {
      fileUrl: string
    },
    { response: { data: { message: string } } },
    { file: File },
    unknown
  >({
    mutationFn: async ({ file }) => {
      const data = await upload({ file })

      return data
    },
    onSuccess: ({ fileUrl }) => {
      setFile(null)
      updateUserMutation.mutate({
        imageUrl: fileUrl,
      })
    },
  })

  function handleEditProfile(data: EditProfile) {
    if (!user) {
      return
    }

    if (file) {
      uploadImageMutation.mutate({
        file,
      })

      return
    }

    updateUserMutation.mutate({
      name: data.name,
    })
  }

  const { isPending: isPendingUpload } = uploadImageMutation
  const { isPending: isPendingUpdateUser } = updateUserMutation

  return (
    <main className="w-full flex min-h-screen">
      <div className="min-w-[400px] space-y-2 flex-grow border-r h-screen px-10 py-20 bg-secondary">
        <div className="w-full flex items-center justify-center">
          <div className="size-32 relative group overflow-hidden rounded-full">
            <label className="opacity-0 absolute cursor-pointer left-0 top-0 right-0 transition-all bottom-0 group-hover:opacity-100 size-32 bg-zinc-900/60 flex items-center justify-center">
              <input
                disabled={isPendingUpload || isPendingUpdateUser}
                onChange={(e) => {
                  const fileTarget = e.target.files?.[0] as File
                  setFile(fileTarget)

                  const objectUrl = URL.createObjectURL(fileTarget)
                  setImagePreview(objectUrl)
                }}
                type="file"
                className="hidden"
              />
              <Pen className="size-10 text-white" weight="fill" />
            </label>

            {!user && (
              <div className="size-32 rounded-full bg-zinc-900/10 animate-pulse"></div>
            )}

            {user && (
              <Image
                width={128}
                height={128}
                src={imagePreview || user.imageUrl}
                alt={user.name}
                className="rounded-full w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="text-center">
          {!user && (
            <>
              <div className="w-[50px] mb-2 mt-5 mx-auto h-4 rounded bg-zinc-900/10 animate-pulse"></div>
              <div className="w-[150px] mx-auto h-3 rounded bg-zinc-900/10 animate-pulse"></div>
            </>
          )}

          {user && (
            <>
              <h1 className="text-lg capitalize font-bold">{user.name}</h1>
              <p>{user.email}</p>
            </>
          )}
        </div>
      </div>

      <div className="w-full  h-screen px-10 py-20">
        <div className="w-full max-w-[700px]">
          <h2 className="text-2xl font-normal mb-10">Editar perfil</h2>
          <form onSubmit={handleSubmit(handleEditProfile)} className="w-full">
            {!user && (
              <div className="w-full mt-2 h-[40px] mb-5 rounded bg-zinc-900/10 animate-pulse"></div>
            )}

            {user && (
              <label className="block space-y-0.5 mb-5">
                <p>Nome</p>
                <Input
                  {...register('name')}
                  placeholder="nome"
                  className="w-full bg-transparent"
                />
              </label>
            )}

            <Button
              disabled={
                isPendingUpdateUser ||
                isPendingUpload ||
                (watch('name') === user?.name && !imagePreview) ||
                !user
              }
              type="submit"
              className="w-full"
            >
              {(isPendingUpdateUser || isPendingUpload) && (
                <Loader2 className="size-5 animate-spin" />
              )}
              Editar perfil
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
