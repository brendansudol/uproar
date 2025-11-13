"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { fetchPost } from "@/lib/utils"

export function Main() {
  const [punchline, setPunchline] = useState("")

  const handleSubmit = async () => {
    try {
      const data = await fetchPost("/api/submit-joke", {
        jokeId: "TODO",
        punchline: punchline,
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
          <Button disabled={punchline.length === 0} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
