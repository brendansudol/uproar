import { NextResponse } from "next/server"

type GetJokeSubmissionsPayload = {
  jokeId: string
}

export async function POST(request: Request) {
  const { jokeId } = (await request.json()) as GetJokeSubmissionsPayload
  void jokeId

  return NextResponse.json({ submissions: [] })
}
