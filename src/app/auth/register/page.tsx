import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default function Register() {
  return (
    <div className="w-full max-h-screen px-9">
      <h2 className="text-center mb-3 mt-8 font-bold text-xl">
        Sign in and start today!
      </h2>
      <form className="w-full">
        <label className="block mb-4 space-y-3">
          <p className="text-base font-normal text-muted-foreground">Name</p>

          <Input type="text" placeholder="John Doe" />
        </label>

        <label className="block mb-6 space-y-3">
          <p className="text-base font-normal text-muted-foreground">
            Email Address
          </p>
          <Input type="text" placeholder="alex@email.comv" />
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
            type="text"
            placeholder="Enter your password"
            className="mb-4"
          />

          <Input type="text" placeholder="Repeat you password" />
        </div>

        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>

      <div className="w-full flex items-center gap-3 my-8">
        <div className="w-full h-0.5 bg-muted-foreground/10"></div>
        <span className="text-sm text-muted-foreground/80">or</span>
        <div className="w-full h-0.5 bg-muted-foreground/10"></div>
      </div>

      <Button asChild variant={'outline'} className="w-full">
        <Link href={'/auth/login'}>Login now</Link>
      </Button>
    </div>
  )
}
