import { NextRequest, NextResponse } from "next/server"
import { moderateJokeSubmission } from "@/lib/ai"

export async function POST(req: NextRequest) {
  try {
    const { punchline } = (await req.json()) as { punchline: string }
    const moderation = await moderateJokeSubmission(punchline)
    return NextResponse.json({ ok: true, data: moderation }, { status: 200 })
  } catch (error) {
    console.error("[POST /api/moderate-joke] Error:", error)
    return NextResponse.json({ ok: false, error: "Internal server error." }, { status: 500 })
  }
}
