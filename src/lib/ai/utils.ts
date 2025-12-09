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
