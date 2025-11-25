import { errorResponse, successResponse } from "@/lib/api-responses"
import { createClient } from "@/lib/supabase/server"

interface Payload {
  jokeId: string
  excludeCurrentUser?: boolean
}

export async function POST(request: Request) {
  const { jokeId, excludeCurrentUser = true } = (await request.json()) as Payload

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

  let submissionsQuery = supabase
    .from("submissions")
    .select("id, setup, punchline, createdAt:created_at, analysis")
    .eq("joke_id", jokeId)

  if (excludeCurrentUser === true) {
    submissionsQuery = submissionsQuery.neq("user_id", userId)
  }

  const submissions = await submissionsQuery.order("created_at", { ascending: false })

  if (submissions.error != null) {
    console.log(submissions.error)
    return errorResponse("Error fetching submissions")
  }

  const results = submissions.data ?? []

  if (results.length === 0) {
    return successResponse({ data: [] })
  }

  const favorites = await supabase
    .from("favorites")
    .select("submission_id")
    .eq("user_id", userId)
    .in(
      "submission_id",
      results.map((submission) => submission.id),
    )

  if (favorites.error != null) {
    console.log(favorites.error)
    return errorResponse("Error fetching submission favorites")
  }

  const favoriteIds = new Set(favorites.data.map((favorite) => favorite.submission_id))

  return successResponse({
    data: results.map((submission) => ({
      ...submission,
      isFavorited: favoriteIds.has(submission.id),
    })),
  })
}
