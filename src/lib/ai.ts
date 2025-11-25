const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL ?? "https://api.openai.com/v1"
const JOKE_ANALYSIS_MODEL = process.env.OPENAI_JOKE_MODEL ?? "gpt-4o-mini"
const MODERATION_MODEL = process.env.OPENAI_MODERATION_MODEL ?? "omni-moderation-latest"

type JsonMessageContent = string | Array<{ type: "text"; text: string }>

type ChatCompletionChoice = {
  message?: {
    content?: JsonMessageContent
  }
}

type ChatCompletionResponse = {
  choices: ChatCompletionChoice[]
}

type ModerationResponse = {
  results: Array<{
    flagged: boolean
    categories: Record<string, boolean>
  }>
}

export type JokeAnalysisResult = {
  rating: number
  analysis: string
}

export type ModerationCheckResult = {
  flagged: boolean
  categories: string[]
}

export async function analyzeJoke(joke: string): Promise<JokeAnalysisResult> {
  const payload = {
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
            analysis: { type: "string", description: "One paragraph of constructive analysis" },
          },
          required: ["rating", "analysis"],
        },
      },
    },
    messages: [
      {
        role: "system",
        content:
          "You are a veteran stand-up comedian. Evaluate jokes succinctly using the requested JSON schema only.",
      },
      {
        role: "user",
        content: `Please rate and analyze the following joke:\n${joke}`,
      },
    ],
  }

  const response = await callOpenAI<ChatCompletionResponse>("/chat/completions", payload)
  const content = extractMessageContent(response.choices[0]?.message?.content)
  const parsed = safeJsonParse<JokeAnalysisResult>(content)

  return {
    rating: clamp(parsed.rating, 0, 10),
    analysis: parsed.analysis,
  }
}

export async function moderateJokeSubmission(input: string): Promise<ModerationCheckResult> {
  const payload = {
    model: MODERATION_MODEL,
    input,
  }

  const response = await callOpenAI<ModerationResponse>("/moderations", payload)
  const result = response.results[0]

  if (!result) {
    throw new Error("OpenAI moderation response did not include a result")
  }

  const categories = Object.entries(result.categories)
    .filter(([, flagged]) => flagged)
    .map(([category]) => category)

  return {
    flagged: result.flagged || categories.length > 0,
    categories,
  }
}

async function callOpenAI<TResponse>(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<TResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  const response = await fetch(`${OPENAI_API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorPayload = await response.text()
    throw new Error(`OpenAI request failed (${response.status}): ${errorPayload}`)
  }

  return (await response.json()) as TResponse
}

function extractMessageContent(content?: JsonMessageContent): string {
  if (typeof content === "string") {
    return content
  }

  if (Array.isArray(content)) {
    const textChunk = content.find((chunk) => chunk.type === "text")
    if (textChunk) {
      return textChunk.text
    }
  }

  throw new Error("OpenAI response was empty")
}

function safeJsonParse<TResult>(value: string): TResult {
  try {
    return JSON.parse(value) as TResult
  } catch (error) {
    throw new Error("Failed to parse JSON from OpenAI response", { cause: error })
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
