import { errorResponse, successResponse } from "@/lib/api-responses"
import { createClient } from "@/lib/supabase/server"

interface Payload {
  submissionId: string
  favorite: boolean
}

export async function POST(request: Request) {
  try {
    const { submissionId, favorite } = (await request.json()) as Payload

    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (userId == null) {
      return errorResponse("Must be signed in", 401)
    }

    const existingFavoriteResponse = await supabase
      .from("favorites")
      .select("id, created_at, submission_id, user_id")
      .eq("submission_id", submissionId)
      .eq("user_id", userId)
      .maybeSingle()

    if (existingFavoriteResponse.error != null) {
      console.error(
        "[POST /api/favorite-submission] Fetch favorite error:",
        existingFavoriteResponse.error,
      )
      return errorResponse("Failed to fetch favorite state.")
    }

    const existingFavorite = existingFavoriteResponse.data

    // Favorite flow:

    if (favorite === true) {
      if (existingFavorite != null) {
        return successResponse({
          data: existingFavorite,
          action: "unchanged",
        })
      }

      const createFavoriteResponse = await supabase
        .from("favorites")
        .insert({ submission_id: submissionId, user_id: userId })
        .select("*")
        .single()

      if (createFavoriteResponse.error != null) {
        console.error(
          "[POST /api/favorite-submission] Create favorite error:",
          createFavoriteResponse.error,
        )
        return errorResponse("Failed to favorite submission.")
      }

      return successResponse({
        data: createFavoriteResponse.data,
        action: "created",
      })
    }

    // Unfavorite flow:

    if (existingFavorite == null) {
      return successResponse({
        data: { submissionId, userId },
        action: "unchanged",
      })
    }

    const deleteFavoriteResponse = await supabase
      .from("favorites")
      .delete()
      .eq("id", existingFavorite.id)

    if (deleteFavoriteResponse.error != null) {
      console.error(
        "[POST /api/favorite-submission] Delete favorite error:",
        deleteFavoriteResponse.error,
      )
      return errorResponse("Failed to unfavorite submission.")
    }

    return successResponse({
      data: { submissionId, userId },
      action: "deleted",
    })
  } catch (error) {
    console.error("[POST /api/favorite-submission] Error:", error)
    return errorResponse("Internal server error.")
  }
}
