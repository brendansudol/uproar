"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { fetchPost } from "@/lib/utils"
import { JokeSetup } from "@/types"
import { useState } from "react"

interface Props {
  joke: JokeSetup
}

export function MainContent({ joke }: Props) {
  const [punchline, setPunchline] = useState("")

  const handleSubmit = async () => {
    try {
      const data = await fetchPost("/api/submit-punchline", {
        jokeId: joke.id,
        punchline: punchline,
      })
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetSubmissions = async () => {
    try {
      const data = await fetchPost("/api/get-submissions", {
        jokeId: joke.id,
      })
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 md:p-8">
      <div className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-wide mb-1">Setup</div>
        <p className="text-xl">{joke.setup}</p>
      </div>

      <div>
        <div className="text-sm font-semibold uppercase tracking-wide mb-1">Punchline</div>
        <Textarea
          className="mb-2"
          value={punchline}
          onChange={(e) => setPunchline(e.currentTarget.value)}
        />
        <Button disabled={punchline.length === 0} onClick={handleSubmit}>
          Submit
        </Button>

        <Separator className="my-5 h-[2px]" />

        <Button onClick={handleGetSubmissions}>Get submissions</Button>
      </div>
    </div>
  )
}
