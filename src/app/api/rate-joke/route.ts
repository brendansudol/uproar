import { errorResponse, successResponse } from "@/lib/api-responses"
import { createClient } from "@/lib/supabase/server"

interface Payload {
  submissionId?: string
  rating?: number
  delete?: boolean
}

export async function POST(request: Request) {
  try {
    const { submissionId, rating, delete: shouldDelete } = (await request.json()) as Payload

    if (submissionId == null) {
      return errorResponse("Submission ID is required.", 400)
    }

    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (userId == null) {
      return errorResponse("Must be signed in")
    }

    if (shouldDelete === true) {
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("submission_id", submissionId)
        .eq("user_id", userId)

      if (deleteError) {
        console.error("[POST /api/rate-joke] Delete error:", deleteError)
        return errorResponse("Failed to delete rating.")
      }

      return successResponse({
        data: { submissionId, userId },
        action: "deleted",
      })
    }

    if (rating == null) {
      return errorResponse("Rating must be provided.", 400)
    }

    const parsedRating = Number(rating)

    if (
      Number.isNaN(parsedRating) ||
      !Number.isInteger(parsedRating) ||
      parsedRating < 0 ||
      parsedRating > 10
    ) {
      return errorResponse("Rating must be a number between 0 and 10.", 400)
    }

    const existingVoteResponse = await supabase
      .from("votes")
      .select("id, score")
      .eq("submission_id", submissionId)
      .eq("user_id", userId)
      .maybeSingle()

    if (existingVoteResponse.error != null) {
      console.error("[POST /api/rate-joke] Fetch vote error:", existingVoteResponse.error)
      return errorResponse("Failed to fetch existing rating.")
    }

    const existingVote = existingVoteResponse.data

    if (existingVote == null) {
      const createResponse = await supabase
        .from("votes")
        .insert({ submission_id: submissionId, user_id: userId, score: parsedRating })
        .select("*")
        .single()

      if (createResponse.error != null) {
        console.error("[POST /api/rate-joke] Create vote error:", createResponse.error)
        return errorResponse("Failed to save rating.")
      }

      return successResponse({
        data: createResponse.data,
        action: "created",
      })
    }

    if (existingVote.score === parsedRating) {
      return successResponse({
        data: { id: existingVote.id, score: existingVote.score },
        action: "unchanged",
      })
    }

    const updateResponse = await supabase
      .from("votes")
      .update({ score: parsedRating })
      .eq("id", existingVote.id)
      .select("*")
      .single()

    if (updateResponse.error != null) {
      console.error("[POST /api/rate-joke] Update vote error:", updateResponse.error)
      return errorResponse("Failed to update rating.")
    }

    return successResponse({
      data: updateResponse.data,
      action: "updated",
    })
  } catch (error) {
    console.error("[POST /api/rate-joke] Error:", error)
    return errorResponse("Internal server error.")
  }
}
