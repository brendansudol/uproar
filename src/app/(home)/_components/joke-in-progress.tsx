"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { fetchPost } from "@/lib/utils"
import { Joke } from "@/types"
import { JokeSetup } from "./joke-setup"

interface Props {
  joke: Joke
}

export function JokeInProgress({ joke }: Props) {
  const jokeId = joke.id
  const [punchline, setPunchline] = useState("")
  const [status, setStatus] = useState<"NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED">("NOT_STARTED")
  const isPending = status === "IN_PROGRESS"

  const handleSubmit = async () => {
    try {
      setStatus("IN_PROGRESS")
      const response = await fetchPost("/api/submit-joke", { jokeId, punchline })
      console.log("Submit joke response:", response)
      setStatus("SUBMITTED")
    } catch (error) {
      console.error(error)
      setStatus("NOT_STARTED")
    }
  }

  useEffect(() => {
    console.log(joke)
  }, [joke])

  return (
    <div className="space-y-6">
      <JokeSetup joke={joke} />

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="text-md font-semibold uppercase tracking-wide bg-yellow-200">
            Your punchline
          </div>
        </header>
        <div className="pt-1 space-y-3">
          <Textarea
            value={punchline}
            onChange={(event) => setPunchline(event.target.value)}
            placeholder="Type your punchline here..."
            aria-label="Your punchline"
          />
          <div className="flex flex-wrap justify-end gap-3">
            <Button disabled={punchline.length === 0 || isPending} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </section>

      {status === "SUBMITTED" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <p className="text-sm text-gray-500">Your punchline has been submitted!</p>
          <Separator className="my-6" />
          <div>TODO: Display community submissions</div>
        </div>
      )}
    </div>
  )
}
