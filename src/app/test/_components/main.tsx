"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { fetchPost } from "@/lib/utils"
import { Joke } from "@/types"

interface Props {
  joke: Joke
}

export function Main({ joke }: Props) {
  const { setup } = joke
  const [punchline, setPunchline] = useState("")
  const [result, setResult] = useState<any>() // eslint-disable-line @typescript-eslint/no-explicit-any

  const handleModerationCheck = async () => {
    if (punchline.trim().length === 0) return

    try {
      const response = await fetchPost("/api/moderate-joke", { punchline })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAnalyzeJoke = async () => {
    if (punchline.trim().length === 0) return

    try {
      const response = await fetchPost("/api/analyze-joke", { setup, punchline })
      setResult(response)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="space-y-4">
        <div>{setup}</div>
        <Textarea
          value={punchline}
          onChange={(event) => setPunchline(event.target.value)}
          placeholder="Type your punchline here..."
          aria-label="Your punchline"
        />
        <div className="flex flex-wrap justify-end gap-3">
          <Button onClick={handleModerationCheck} variant="outline">
            Moderate
          </Button>
          <Button onClick={handleAnalyzeJoke} variant="outline">
            Analyze
          </Button>
        </div>
      </div>
      <div>{result && <pre className="whitespace-normal">{JSON.stringify(result)}</pre>}</div>
    </div>
  )
}
