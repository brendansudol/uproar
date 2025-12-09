import { NextRequest, NextResponse } from "next/server"
import { analyzeJoke } from "@/lib/ai"

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 })
  }

  try {
    const { setup, punchline } = (await req.json()) as { setup: string; punchline: string }
    const completeJoke = `${setup} ${punchline}`
    const analysis = await analyzeJoke({ joke: completeJoke })
    return NextResponse.json({ ok: true, data: { analysis } }, { status: 200 })
  } catch (error) {
    console.error("[POST /api/analyze-joke] Error:", error)
    return NextResponse.json({ ok: false, error: "Internal server error." }, { status: 500 })
  }
}
