import { errorResponse, successResponse } from "@/lib/api-responses"
import { createClient } from "@/lib/supabase/server"

interface Payload {
  jokeId: string
}

export async function POST(request: Request) {
  const { jokeId } = (await request.json()) as Payload

  if (jokeId == null) {
    return errorResponse("No joke specified")
  }

  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  if (userId == null) {
    return errorResponse("Must be signed in")
  }

  const joke = await supabase.from("jokes").select("*").eq("id", jokeId).single()

  if (joke.error != null) {
    console.log(joke.error)
    return errorResponse(`Invalid joke (id=${jokeId})`)
  }

  const submissions = await supabase
    .from("submissions")
    .select("id, setup, punchline, createdAt:created_at, analysis")
    .eq("joke_id", jokeId)
    .order("created_at", { ascending: false })

  if (submissions.error != null) {
    console.log(submissions.error)
    return errorResponse("Error fetching submissions")
  }

  return successResponse({
    data: submissions.data,
  })
}
