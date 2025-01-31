import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Schema for joke rating response
const jokeRatingSchema = z.object({
  rating: z.number().min(1).max(10),
  analysis: z.string(),
})

// Schema for punchline suggestions
const punchlinesSchema = z.object({
  punchlines: z
    .array(
      z.object({
        punchline: z.string(),
        explanation: z.string(),
      })
    )
    .min(2)
    .max(4),
})

/**
 * Analyzes a joke and returns a rating and analysis
 * @param setup The setup of the joke
 * @param punchline The punchline of the joke
 * @returns A rating from 1-10 and analysis of the joke
 */
export async function analyzeJoke(setup: string, punchline: string) {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: jokeRatingSchema,
      prompt: `You are a professional comedy critic. Analyze this joke and provide a rating from 1-10 and a brief analysis of why it's funny or not funny.
      
      Setup: ${setup}
      Punchline: ${punchline}
      
      Be honest but constructive in your analysis.`,
    })

    return object
  } catch (error) {
    console.error("Error analyzing joke:", error)
    throw new Error("Failed to analyze joke")
  }
}

/**
 * Generates punchline suggestions for a given joke setup
 * @param setup The setup of the joke
 * @returns An array of punchline suggestions with explanations
 */
export async function generatePunchlines(setup: string) {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: punchlinesSchema,
      prompt: `You are a professional comedy writer. Given this joke setup, generate 2-4 creative and funny punchline options. For each punchline, provide a brief explanation of why it works.
      
      Setup: ${setup}
      
      Be creative and vary the style of humor between the options.`,
    })

    return object
  } catch (error) {
    console.error("Error generating punchlines:", error)
    throw new Error("Failed to generate punchlines")
  }
}

export type JokeAnalysis = z.infer<typeof jokeRatingSchema>
export type PunchlineSuggestions = z.infer<typeof punchlinesSchema>
