"use client"

import { getURL } from "@/lib/get-url"
import { createClient } from "@/lib/supabase/client"

export function SignIn() {
  const handleClick = async () => {
    const supabase = createClient()
    const redirectTo = getURL("/auth/callback")

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })
  }

  return <button onClick={handleClick}>sign in</button>
}
