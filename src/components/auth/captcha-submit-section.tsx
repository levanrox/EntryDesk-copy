'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { TurnstileField } from '@/components/auth/turnstile-field'
import { PendingButton } from '@/components/ui/pending-button'

type CaptchaSubmitSectionProps = {
  formId: string
  submitText: string
  pendingText: string
  showArrow?: boolean
  isEnabled?: boolean
}

export function CaptchaSubmitSection({
  formId,
  submitText,
  pendingText,
  showArrow = false,
  isEnabled = true,
}: CaptchaSubmitSectionProps) {
  const [isReady, setIsReady] = useState(false)
  const canSubmit = isReady && isEnabled

  return (
    <>
      <TurnstileField formId={formId} onTokenChange={setIsReady} />
      <PendingButton
        type="submit"
        disabled={!canSubmit}
        pendingText={pendingText}
        className={canSubmit ? 'mt-1 h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700' : 'mt-1 h-11 w-full bg-muted text-muted-foreground hover:bg-muted'}
      >
        {submitText}
        {showArrow ? <ArrowRight className="h-4 w-4" /> : null}
      </PendingButton>
    </>
  )
}