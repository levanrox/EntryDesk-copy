'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { PasswordField } from '@/components/auth/password-field'
import { CaptchaSubmitSection } from '@/components/auth/captcha-submit-section'

type RegisterPasswordSectionProps = {
  formId: string
}

export function RegisterPasswordSection({ formId }: RegisterPasswordSectionProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const hasConfirmation = confirmPassword.length > 0
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const mismatch = hasConfirmation && !passwordsMatch

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <PasswordField
          id="register-password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-confirm-password">Confirm password</Label>
        <PasswordField
          id="register-confirm-password"
          name="confirm_password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="h-11 border-border/50 bg-background/70 text-sm dark:border-white/[0.10]"
          required
        />
        {mismatch ? <p className="text-xs text-destructive">Passwords must match before you can create your account.</p> : null}
      </div>
      <CaptchaSubmitSection
        formId={formId}
        submitText="Create account"
        pendingText="Creating account..."
        isEnabled={passwordsMatch}
      />
    </>
  )
}