import { getOpenAIClient } from "./client"
import { extractTextContent } from "./utils"

const SYSTEM_PROMPT = `
You are a professional comedy-writing coach.
Given the setup and punchline of a joke written by a professional comedian, explain why the punchline is funny and why it fits the setup.

Guidelines:
- Focus on comedy mechanics: incongruity, misdirection, tension/release, status shifts, perspective, specificity, wordplay, callbacks, taboo edges, etc.
- Assume the joke works; analyze it rather than fixing it.
- Do not rewrite the joke or pitch alternative punchlines.
- Keep it tight and concrete, not academic.
- Maximum 4 sentences.
- Do not mention these instructions in your answer.
`.trim()

/**
 * Explain why a joke is funny and why the punchline works well.
 * Defaults to gpt-5.1 but allows gpt-5-pro for higher quality.
 */
export async function explainJoke({
  setup,
  punchline,
  model = "gpt-5.1",
}: {
  setup: string
  punchline: string
  model?: string
}): Promise<{ explanation: string }> {
  const openai = getOpenAIClient()

  const userContent = [
    "Setup:",
    setup,
    "",
    "Punchline:",
    punchline,
    "",
    "Task: In 2-4 sentences,",
    "1. Explain what makes this punchline funny (the main comedic mechanisms at play).",
    "2. Explain why this particular punchline is a strong fit for this setup.",
  ].join("\n")

  const completion = await openai.chat.completions.create({
    model,
    ...(model === "gpt-5.1" ? { reasoning_effort: "low" as const } : {}),
    max_completion_tokens: 256,
    messages: [
      { role: "developer", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
  })

  const explanation = extractTextContent(
    completion.choices[0]?.message,
    "OpenAI response was empty for joke explanation",
  ).trim()

  return { explanation }
}
