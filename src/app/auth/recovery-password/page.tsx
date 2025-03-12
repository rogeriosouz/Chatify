import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FormRecoveryPassword } from './components/form-recovery-password'

export default function RecoveryPassword() {
  return (
    <div className="w-full max-h-screen px-9 ">
      <h2 className="text-center mb-11 mt-8 font-bold text-xl">
        Recovery password
      </h2>

      <FormRecoveryPassword />

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
