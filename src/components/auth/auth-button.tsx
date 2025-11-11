import { createClient } from "@/lib/supabase/server"
import { SignInButton } from "./sign-in-button"
import { UserNav } from "./user-nav"

export async function AuthButton() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (data.user == null) {
    return <SignInButton />
  }

  return <UserNav user={data.user} />
}
