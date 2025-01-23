"use client"

import { createClient } from "@/utils/supabase/client"
import { getURL } from "@/utils/supabase/misc"

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
