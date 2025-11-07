import { NextResponse } from "next/server"

type RateJokePayload = {
  submissionId: string
  rating: number
}

export async function POST(request: Request) {
  const { submissionId, rating } = (await request.json()) as RateJokePayload
  void submissionId
  void rating

  return NextResponse.json({ status: "queued" })
}
