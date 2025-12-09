import { getOpenAIClient } from "./client"
import { clampNumber, extractTextContent, parseJsonContent } from "./utils"

const JOKE_ANALYSIS_MODEL = process.env.OPENAI_JOKE_MODEL ?? "gpt-4o-mini"

const SYSTEM_PROMPT =
  "You are a veteran stand-up comedian. Evaluate jokes succinctly using the requested JSON schema only."

interface Return {
  rating: number
  analysis: string
}

export async function analyzeJoke({ joke }: { joke: string }): Promise<Return> {
  const openai = getOpenAIClient()

  const completion = await openai.chat.completions.create({
    model: JOKE_ANALYSIS_MODEL,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "joke_analysis",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            rating: {
              type: "number",
              description: "Score the joke from 0 (terrible) to 10 (legendary)",
            },
            analysis: {
              type: "string",
              description: "One paragraph of constructive analysis",
            },
          },
          required: ["rating", "analysis"],
        },
      },
    },
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Please rate and analyze the following joke:\n${joke}`,
      },
    ],
  })

  const content = extractTextContent(
    completion.choices[0]?.message,
    "OpenAI response was empty for joke analysis",
  )

  const parsed = parseJsonContent<Return>(content, "Joke analysis response parsing failed")

  return {
    rating: clampNumber(typeof parsed.rating === "number" ? parsed.rating : 0, 0, 10),
    analysis: typeof parsed.analysis === "string" ? parsed.analysis : "",
  }
}
