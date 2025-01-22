"use client"

import { createClient } from "@/utils/supabase/client"
import { getURL } from "@/utils/supabase/misc"

export default function Home() {
  const handleAuth = async () => {
    const supabase = createClient()
    const redirectTo = getURL("/auth/callback")

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>hello!</div>
        <div>{getURL("/auth/callback")}</div>
        <button onClick={handleAuth}>sign in with google</button>
      </main>
    </div>
  )
}
