import OpenAI from "openai"

let openaiClient: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (openaiClient) {
    return openaiClient
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL,
  })

  return openaiClient
}

type MessageContent = string | Array<{ type: "text"; text: string }> | null | undefined

export function extractTextContent(
  message?: { content?: MessageContent },
  errorMessage = "OpenAI response did not include text content",
): string {
  const content = message?.content

  if (typeof content === "string") {
    return content.trim()
  }

  if (Array.isArray(content)) {
    const textChunk = content.find((chunk) => chunk.type === "text")
    if (textChunk?.text) {
      return textChunk.text.trim()
    }
  }

  throw new Error(errorMessage)
}

export function parseJsonContent<T>(
  content: string,
  errorContext = "Failed to parse JSON from OpenAI response",
): T {
  try {
    return JSON.parse(content) as T
  } catch (error) {
    throw new Error(errorContext, { cause: error })
  }
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
