import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from './button'
import { Eye, EyeClosed } from 'lucide-react'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    const [visiblePassword, setVisiblePassword] = React.useState(false)

    return (
      <>
        <div className="w-full relative">
          <input
            type={
              type === 'password'
                ? visiblePassword
                  ? 'text'
                  : 'password'
                : type
            }
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-secondary px-4 py-1 text-base text-neutral-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              className,
            )}
            ref={ref}
            {...props}
          />

          {type === 'password' && (
            <Button
              onClick={() => setVisiblePassword(!visiblePassword)}
              size={'icon'}
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-0 size-10"
            >
              {visiblePassword ? (
                <EyeClosed className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </Button>
          )}
        </div>
      </>
    )
  },
)
Input.displayName = 'Input'

export { Input }
