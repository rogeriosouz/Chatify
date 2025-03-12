'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { forgotPassword as forgotPasswordApi } from '@/api/forgot-password'

const schemaForgotPassword = z.object({
  email: z.string().email(),
})

type ForgotPasswordParams = z.infer<typeof schemaForgotPassword>

export function FormForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordParams>({
    resolver: zodResolver(schemaForgotPassword),
  })

  const forgotPasswordMutation = useMutation<
    { message: string },
    { response: { data: { message: string } } },
    { email: string },
    unknown
  >({
    mutationFn: async ({ email }) => {
      const data = await forgotPasswordApi({ email })

      return data
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    },
    onSuccess: ({ message }) => {
      toast.success(message, {
        className: '!w-[400px] !h-[70px] !bg-green-500 !text-black',
      })
    },
  })

  function forgotPassword({ email }: ForgotPasswordParams) {
    forgotPasswordMutation.mutate({ email })
  }

  useEffect(() => {
    if (errors.email) {
      toast.error(errors.email.message, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    }
  }, [errors])

  const { isPending } = forgotPasswordMutation

  return (
    <form className="w-full" onSubmit={handleSubmit(forgotPassword)}>
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

      <Button disabled={isPending} type="submit" className="w-full">
        {isPending && <Loader2 className="size-5 animate-spin" />}
        Forgot password
      </Button>
    </form>
  )
}
