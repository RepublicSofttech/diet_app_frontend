import * as React from 'react'
import { Mail } from 'lucide-react'
import { cn } from '../lib'
import { Input } from '../components/ui/input'

export interface EmailInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="email"
          className={cn('pl-10', className)}
          {...props}
        />
        <Mail
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    )
  },
)

EmailInput.displayName = 'EmailInput'

export { EmailInput }
