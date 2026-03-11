'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type PasswordFieldProps = InputProps

export function PasswordField({ className, ...props }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-11', className)}
      />
      <button
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        className="absolute right-3 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 appearance-none items-center justify-center rounded-sm border-0 bg-transparent p-0 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}