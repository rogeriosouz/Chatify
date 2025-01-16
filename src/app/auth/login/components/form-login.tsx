'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'sonner'

const schemaLogin = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

type LoginParams = z.infer<typeof schemaLogin>

export function FormLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginParams>({
    resolver: zodResolver(schemaLogin),
  })

  function login(data: LoginParams) {
    console.log(data)
  }

  useEffect(() => {
    if (errors.email || errors.password) {
      toast.error(
        errors.email ? errors.email.message : errors.password?.message,
        {
          className: '!w-[400px] !h-[70px] !bg-red-500 !text-white',
        },
      )
    }
  }, [errors])

  return (
    <form className="w-full" onSubmit={handleSubmit(login)}>
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

      <label className="block space-y-3">
        <p className="text-base font-normal text-muted-foreground">Password</p>
        <Input
          {...register('password')}
          type="text"
          placeholder="Enter your password"
        />
      </label>

      <Link
        href={'/auth/recovery-password'}
        className="mb-8 block hover:underline hover:text-primary-foreground/80 transition-all mt-2 text-sm text-primary-foreground text-right"
      >
        Forgot Password?
      </Link>

      <Button type="submit" className="w-full">
        Login Now
      </Button>
    </form>
  )
}
