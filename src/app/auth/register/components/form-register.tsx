'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { register as registerApi } from '@/api/register'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const schemaRegister = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3),
    confirmPassword: z.string().min(3),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      toast.error('The passwords did not match', {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })

      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })

type RegisterParams = z.infer<typeof schemaRegister>

export function FormRegister() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterParams>({
    resolver: zodResolver(schemaRegister),
  })
  const { push } = useRouter()

  const { mutate, isPending } = useMutation<
    { message: string },
    { response: { data: { message: string } } },
    { name: string; email: string; password: string },
    unknown
  >({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success('Success created user', {
        className: '!w-[400px] !h-[70px] !bg-green-500 !text-black',
      })

      setTimeout(() => {
        push('/auth/login')
      }, 1000)
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    },
  })

  function registerFn({ name, email, password }: RegisterParams) {
    mutate({ name, email, password })
  }

  useEffect(() => {
    let messageError = null
    if (errors.email || errors.password || errors.name) {
      if (errors.name) {
        messageError = errors.name.message
      }
      if (errors.email) {
        messageError = errors.email.message
      }
      if (errors.password) {
        messageError = errors.password.message
      }

      toast.error(messageError, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    }
  }, [errors])

  return (
    <form className="w-full" onSubmit={handleSubmit(registerFn)}>
      <label className="block mb-4 space-y-3">
        <p className="text-base font-normal text-muted-foreground">Name</p>

        <Input {...register('name')} type="text" placeholder="John Doe" />
      </label>

      <label className="block mb-6 space-y-3">
        <p className="text-base font-normal text-muted-foreground">
          Email Address
        </p>
        <Input
          {...register('email')}
          type="text"
          placeholder="alex@email.comv"
        />
      </label>

      <div className="w-full mb-7">
        <label
          className="text-base mb-3 block font-normal text-muted-foreground"
          htmlFor="password"
        >
          Password
        </label>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="mb-4"
          {...register('password')}
        />

        <Input
          type="password"
          placeholder="Repeat you password"
          {...register('confirmPassword')}
        />
      </div>

      <Button disabled={isPending} type="submit" className="w-full">
        {isPending && <Loader2 className="size-5 animate-spin" />}
        Sign up
      </Button>
    </form>
  )
}
