"use client"

import { Button } from "@/components/ui/button"
import { getURL } from "@/lib/get-url"
import { createClient } from "@/lib/supabase/client"

export function SignInButton() {
  const handleClick = async () => {
    const supabase = createClient()
    const redirectTo = getURL("/auth/callback")

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })
  }

  return (
    <Button onClick={handleClick} size="sm" variant="outline">
      Sign in
    </Button>
  )
}
