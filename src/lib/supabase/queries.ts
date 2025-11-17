import { createClient } from "@/lib/supabase/server"

export async function getJoke(dateISO: string = "2025-01-01") {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("jokes")
    .select("*")
    .eq("active_date", dateISO)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getUserSubmission(jokeId: string) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  if (userId == null) {
    return
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("joke_id", jokeId)
    .eq("user_id", userId)
    .limit(1)

  if (error) {
    throw new Error(error.message)
  }

  return data?.[0]
}
