import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `
You are a comedy ideation assistant.
Given a joke setup and an example punchline, provide creative directions the writer could explore.

Guidelines:
- Return one short line containing 2-3 distinct directions separated by "; ".
- Offer angles, contrasts, or beats to explore. Do not deliver a full punchline.
- You may use the provided punchline as a hint, but vary the directions so the writer has options.
- Keep it concise and specific.
`.trim()

/**
 * Produce 2-3 creative directions (semicolon-separated) to inspire a punchline.
 */
export async function generateJokeHelp(options: {
  setup: string
  punchline: string
  tags?: string
  model?: string
}): Promise<string> {
  const { setup, punchline, tags, model = "gpt-5.1" } = options

  const userContent = [
    "Setup:",
    setup,
    "",
    "Example punchline:",
    punchline,
    "",
    tags ? `Tags: ${tags}` : null,
    "",
    "Task: Return 2-3 concise creative directions, separated by '; '. Do not provide a full punchline.",
  ]
    .filter(Boolean)
    .join("\n")

  const completion = await openai.chat.completions.create({
    model,
    ...(model === "gpt-5.1" ? { reasoning_effort: "low" as const } : {}),
    max_completion_tokens: 128,
    messages: [
      { role: "developer", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
  })

  const message = completion.choices[0]?.message
  const content =
    typeof message?.content === "string"
      ? message.content
      : ((message?.content as any)?.[0]?.text ?? "") // eslint-disable-line @typescript-eslint/no-explicit-any

  return content.trim()
}
