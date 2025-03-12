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
import { recoveryPassword as recoveryPasswordApi } from '@/api/recovery-password'
import { useRouter, useSearchParams } from 'next/navigation'

const schemaRecoveryPassword = z
  .object({
    newPassword: z.string().min(3),
    confirmNewPassword: z.string().min(3),
  })
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      toast.error('The passwords did not match', {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })

      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmNewPassword'],
      })
    }
  })

type RecoveryPasswordParams = z.infer<typeof schemaRecoveryPassword>

export function FormRecoveryPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryPasswordParams>({
    resolver: zodResolver(schemaRecoveryPassword),
  })
  const queryParams = useSearchParams()
  const token = queryParams.get('token')

  const { push } = useRouter()
  const recoveryPasswordMutation = useMutation<
    { message: string },
    { response: { data: { message: string } } },
    { token: string; newPassword: string },
    unknown
  >({
    mutationFn: async ({ token, newPassword }) => {
      const data = await recoveryPasswordApi({ token, newPassword })

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

      setTimeout(() => {
        push('/auth/login')
      }, 1000)
    },
  })

  function recoveryPassword({ newPassword }: RecoveryPasswordParams) {
    recoveryPasswordMutation.mutate({ token: token || '', newPassword })
  }

  useEffect(() => {
    if (errors.newPassword) {
      toast.error(errors.newPassword.message, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    }
  }, [errors])

  const { isPending } = recoveryPasswordMutation

  return (
    <form className="w-full" onSubmit={handleSubmit(recoveryPassword)}>
      <label className="block mb-6 space-y-3">
        <p className="text-base font-normal text-muted-foreground">
          New password
        </p>

        <Input
          {...register('newPassword')}
          type="password"
          placeholder="New password"
        />
      </label>

      <label className="block mb-6 space-y-3">
        <p className="text-base font-normal text-muted-foreground">
          Confirm new password
        </p>

        <Input
          {...register('confirmNewPassword')}
          type="password"
          placeholder="Confirm new password"
        />
      </label>

      <Button disabled={isPending} type="submit" className="w-full">
        {isPending && <Loader2 className="size-5 animate-spin" />}
        Recovery password
      </Button>
    </form>
  )
}
