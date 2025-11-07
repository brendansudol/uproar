import { NextResponse } from "next/server"

type SubmitJokePayload = {
  jokeId: string
  punchline: string
}

export async function POST(request: Request) {
  const { jokeId, punchline } = (await request.json()) as SubmitJokePayload
  void jokeId
  void punchline

  return NextResponse.json({ status: "pending" })
}
