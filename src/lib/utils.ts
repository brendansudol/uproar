import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchPost<T extends Record<string, unknown>>(url: string, params?: T) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })

  const data = await response.json()

  if (process.env.NODE_ENV === "development") {
    console.log(`${url} response:`, data)
  }

  return data
}

export function parseJokeAnalysis(
  analysis: unknown,
): { rating: number; commentary: string } | undefined {
  if (analysis == null || typeof analysis !== "object") return

  const { rating, analysis: commentary } = analysis as { rating?: unknown; analysis?: unknown }

  if (typeof rating !== "number") return

  return {
    rating: Math.min(Math.max(rating, 0), 10),
    commentary: typeof commentary === "string" ? commentary : "Joke analysis unavailable.",
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
