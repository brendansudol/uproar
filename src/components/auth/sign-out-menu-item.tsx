"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export function SignOutMenuItem() {
  const router = useRouter()
  const [pending, start] = useTransition()

  return (
    <DropdownMenuItem
      disabled={pending}
      onSelect={() =>
        start(async () => {
          const supabase = createClient()
          await supabase.auth.signOut()
          router.refresh()
        })
      }
    >
      {pending ? "Logging out…" : "Log out"}
    </DropdownMenuItem>
  )
}
