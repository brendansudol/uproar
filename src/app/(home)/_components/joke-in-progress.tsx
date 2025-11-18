"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { fetchPost } from "@/lib/utils"
import { Joke } from "@/types"
import { SubmissionsList } from "./submissions-list"

interface Props {
  joke: Joke
}

export function JokeInProgress({ joke }: Props) {
  const jokeId = joke.id
  const [punchline, setPunchline] = useState("")
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleSubmit = async () => {
    try {
      const response = await fetchPost("/api/submit-joke", { jokeId, punchline })
      console.log(response)
      setHasSubmitted(true)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log(joke)
  }, [joke])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="space-y-4">
        <div>{joke.setup}</div>
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

      {hasSubmitted && (
        <>
          <Separator className="my-6" />
          <SubmissionsList jokeId={jokeId} />
        </>
      )}
    </div>
  )
}
