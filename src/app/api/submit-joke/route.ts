import { NextRequest } from "next/server"
import { analyzeJoke, moderateJokeSubmission } from "@/lib/ai"
import { errorResponse, successResponse } from "@/lib/api-responses"
import { createClient } from "@/lib/supabase/server"

interface Payload {
  jokeId: string
  punchline: string
}

export async function POST(req: NextRequest) {
  try {
    const { jokeId, punchline } = (await req.json()) as Payload

    if (punchline == null || punchline.length === 0) {
      return errorResponse("No punchline provided.", 400)
    }

    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (userId == null) {
      return errorResponse("User not authenticated.", 401)
    }

    const joke = await supabase.from("jokes").select("*").eq("id", jokeId).single()

    if (joke.error != null) {
      return errorResponse("Joke not found.", 404)
    }

    const moderation = await moderateJokeSubmission(punchline)
    console.log("Moderation result:", moderation)

    if (moderation.flagged) {
      // TODO: should we log these flagged jokes somewhere?
      return errorResponse("Joke did not pass moderation.", 400)
    }

    const { setup } = joke.data
    const completeJoke = `${setup} ${punchline}`
    const analysis = await analyzeJoke(completeJoke)
    console.log("Joke analysis:", analysis)

    const submission = await supabase
      .from("submissions")
      .insert([{ joke_id: jokeId, user_id: userId, setup, punchline, analysis }])
      .select("id, setup, punchline, createdAt:created_at, analysis")
      .single()

    if (submission.error != null) {
      return errorResponse("Failed to create submission.")
    }

    return successResponse({ data: submission.data })
  } catch (error) {
    console.error("[POST /api/submit-joke] Error:", error)
    return errorResponse("Internal server error.")
  }
}
