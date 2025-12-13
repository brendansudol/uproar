import { createClient } from "@/lib/supabase/server"

export async function getJoke(dateISO: string = "2025-01-01") {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("jokes")
    .select("id, setup, punchline, commentary, activeDate:active_date, help, commentary")
    .eq("active_date", dateISO)
    .maybeSingle()

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
    .select("id, setup, punchline, createdAt:created_at, analysis")
    .eq("joke_id", jokeId)
    .eq("user_id", userId)
    .limit(1)

  if (error) {
    throw new Error(error.message)
  }

  return data?.[0]
}
