import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { jokeId } = await req.json()

  if (jokeId == null) {
    return errorResponse("No joke ID")
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
    .select("*")
    .eq("joke_id", jokeId)
    .order("created_at", { ascending: false })

  if (submissions.error != null) {
    console.log(submissions.error)
    return errorResponse("Error fetching submissions")
  }

  return NextResponse.json(
    {
      status: "success",
      data: submissions.data,
    },
    { status: 200 }
  )
}

function errorResponse(reason: string, status = 500) {
  return NextResponse.json({ status: "error", reason }, { status })
}
