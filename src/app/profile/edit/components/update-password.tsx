import { updatePassword } from '@/api/update-password'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schemaUpdatePassword = z
  .object({
    password: z.string().min(2),
    newPassword: z.string().min(2),
    confimNewPassword: z.string().min(2),
  })
  .superRefine(({ confimNewPassword, newPassword }, ctx) => {
    if (confimNewPassword !== newPassword) {
      toast.error('The passwords did not match', {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })

      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['newPassword'],
      })
    }
  })

type UpdatePassword = z.infer<typeof schemaUpdatePassword>

export function UpdatePassword() {
  const { handleSubmit, register } = useForm<UpdatePassword>({
    resolver: zodResolver(schemaUpdatePassword),
  })

  const updatePasswordMutation = useMutation<
    {
      message: string
    },
    { response: { data: { message: string } } },
    { password: string; newPassword: string },
    unknown
  >({
    mutationFn: async ({ password, newPassword }) => {
      const data = await updatePassword({
        password,
        newPassword,
      })

      return data
    },
    onSuccess: () => {
      toast.success('Usuario editado com sucesso', {
        className: '!w-[400px] !h-[70px] !bg-green-500 !text-black',
      })
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
      })
    },
  })

  function handleUpdatePassword(data: UpdatePassword) {
    updatePasswordMutation.mutate({
      password: data.password,
      newPassword: data.password,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleUpdatePassword)} className="w-full">
      <div className="mb-10 flex items-center gap-2">
        <Lock className="size-10 text-primary" weight="fill" />

        <h2 className="text-xl font-medium">Update password</h2>
      </div>

      <label className="block space-y-0.5 mb-2">
        <p>Password</p>
        <Input
          {...register('password')}
          placeholder="password"
          type="password"
          className="w-full bg-transparent"
        />
      </label>

      <label className="block space-y-0.5 mb-2">
        <p>New Password</p>
        <Input
          {...register('newPassword')}
          placeholder="new password"
          type="password"
          className="w-full bg-transparent"
        />
      </label>

      <label className="block space-y-0.5 mb-5">
        <p>Confirm new password</p>
        <Input
          {...register('confimNewPassword')}
          placeholder="confim new password"
          type="password"
          className="w-full bg-transparent"
        />
      </label>

      <Button type="submit" className="w-full ">
        Update password
      </Button>
    </form>
  )
}
