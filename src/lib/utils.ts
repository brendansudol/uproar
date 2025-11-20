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

  return { status: response.status, ...data }
}
