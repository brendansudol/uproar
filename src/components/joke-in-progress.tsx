"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { fetchPost } from "@/lib/utils"
import { Joke, Submission } from "@/types"
import { JokeSetup } from "./joke-setup"

interface Props {
  joke: Joke
}

export function JokeInProgress({ joke }: Props) {
  const [punchline, setPunchline] = useState("")
  const [userEntry, setUserEntry] = useState<Submission>()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await fetchPost("/api/submit-joke", { jokeId: joke.id, punchline })
      if (!response.ok) throw new Error(response.error ?? "Unknown error")
      setUserEntry(response.data as Submission)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <JokeSetup joke={joke} />

      {userEntry == null && (
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
              {joke.help && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Need hint?</Button>
                  </PopoverTrigger>
                  <PopoverContent className="max-w-sm text-sm leading-relaxed">
                    {joke.help}
                  </PopoverContent>
                </Popover>
              )}
              <Button disabled={punchline.length === 0 || isLoading} onClick={handleSubmit}>
                {isLoading && <Spinner />}
                Submit
              </Button>
            </div>
          </div>
        </section>
      )}

      {userEntry != null && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <p className="text-sm text-gray-500">Your punchline has been submitted!</p>
            <Separator className="my-6" />
            <div>TODO: community submissions</div>
          </div>
        </>
      )}
    </div>
  )
}
