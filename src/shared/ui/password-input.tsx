'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../lib'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
