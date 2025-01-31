import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { jokeId, punchline } = await req.json()

  if (punchline == null) {
    return errorResponse("No punchline")
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

  const { setup } = joke.data
  const submission = await supabase
    .from("submissions")
    .insert([{ joke_id: jokeId, user_id: userId, setup, punchline }])
    .select("*")
    .single()
  if (submission.error != null) {
    console.log(submission.error)
    return errorResponse("Error saving submission")
  }

  return NextResponse.json({ status: "success", data: submission.data }, { status: 200 })
}

function errorResponse(reason: string, status = 500) {
  return NextResponse.json({ status: "error", reason }, { status })
}
