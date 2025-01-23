import { createClient } from "@/utils/supabase/server"

export async function Auth() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  return <div>{JSON.stringify(userData.user ?? {})}</div>
}
