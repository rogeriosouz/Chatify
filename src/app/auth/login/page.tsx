import { Button } from '@/components/ui/button'
import { FormLogin } from './components/form-login'
import Link from 'next/link'

export default function Login() {
  return (
    <div className="w-full max-h-screen px-9">
      <h2 className="text-center mb-11 mt-8 font-bold text-xl">
        Login into your account
      </h2>

      <FormLogin />

      <div className="w-full flex items-center gap-3 my-8">
        <div className="w-full h-0.5 bg-muted-foreground/10"></div>
        <span className="text-sm text-muted-foreground/80">or</span>
        <div className="w-full h-0.5 bg-muted-foreground/10"></div>
      </div>

      <Button asChild variant={'outline'} className="w-full">
        <Link href={'/auth/register'}>Signup Now</Link>
      </Button>
    </div>
  )
}
