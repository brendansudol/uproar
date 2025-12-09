import { getOpenAIClient } from "./client"
import { extractTextContent } from "./utils"

const SYSTEM_PROMPT = `
You are a comedy ideation assistant.
Given a joke setup and an example punchline, provide creative directions the writer could explore.

Guidelines:
- Return one short line containing 2-3 distinct directions separated by "; ".
- Offer angles, contrasts, or beats to explore. Do not deliver a full punchline.
- You may use the provided punchline as a hint, but vary the directions so the writer has options.
- Keep it concise and specific.
`.trim()

export async function generateJokeHelp({
  setup,
  punchline,
  tags,
  model = "gpt-5.1",
}: {
  setup: string
  punchline: string
  tags?: string
  model?: string
}): Promise<{ help: string }> {
  const openai = getOpenAIClient()

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

  const content = extractTextContent(
    completion.choices[0]?.message,
    "OpenAI response was empty for joke help",
  ).trim()

  return { help: content }
}
