import { getOpenAIClient } from "./client"

const MODERATION_MODEL = process.env.OPENAI_MODERATION_MODEL ?? "omni-moderation-latest"

export async function moderateJoke({ input }: { input: string }): Promise<{
  flagged: boolean
  categories: string[]
}> {
  const openai = getOpenAIClient()

  const moderation = await openai.moderations.create({
    model: MODERATION_MODEL,
    input,
  })

  const result = moderation.results?.[0]
  if (!result) {
    throw new Error("OpenAI moderation response did not include a result")
  }

  const categories = Object.entries(result.categories ?? {})
    .filter(([, flagged]) => Boolean(flagged))
    .map(([category]) => category)

  return {
    flagged: Boolean(result.flagged ?? categories.length > 0),
    categories,
  }
}
