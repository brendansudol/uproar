"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { getURL } from "@/lib/get-url"
import { createClient } from "@/lib/supabase/client"

export function SignInButton() {
  const [pending, start] = useTransition()

  const handleClick = () =>
    start(async () => {
      const supabase = createClient()
      const redirectTo = getURL("/auth/callback")

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
    })

  return (
    <Button disabled={pending} onClick={handleClick} size="sm" variant="outline">
      Sign in
    </Button>
  )
}
