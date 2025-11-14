"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { fetchPost } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export function Main() {
  const [punchline, setPunchline] = useState("")

  const handleSubmit = async () => {
    try {
      const response = await fetchPost("/api/submit-joke", {
        jokeId: "TODO",
        punchline: punchline,
      })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  const handleModerationCheck = async () => {
    if (punchline.trim().length === 0) return

    try {
      const response = await fetchPost("/api/moderate-joke", { punchline })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetSubmissions = async () => {
    try {
      const data = await fetchPost("/api/get-submissions", {
        jokeId: "TODO",
      })
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="space-y-4">
        <Textarea
          value={punchline}
          onChange={(event) => setPunchline(event.target.value)}
          placeholder="Type your punchline here..."
          aria-label="Your punchline"
        />
        <div className="flex flex-wrap justify-end gap-3">
          <Button
            variant="outline"
            disabled={punchline.length === 0}
            onClick={handleModerationCheck}
          >
            Check
          </Button>
          <Button disabled={punchline.length === 0} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <Button variant="outline" onClick={handleGetSubmissions}>
          View submissions
        </Button>
      </div>
    </div>
  )
}
