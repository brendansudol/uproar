"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { fetchPost } from "@/lib/utils"
import { Joke, Submission } from "@/types"
import { JokeSetup } from "./joke-setup"

interface Props {
  joke: Joke
  isAuthed: boolean
}

export function JokeInProgress({ joke, isAuthed }: Props) {
  const router = useRouter()

  const [punchline, setPunchline] = useState("")
  const [userEntry, setUserEntry] = useState<Submission>()
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, startTransition] = useTransition()

  const isPending = isLoading || isRefreshing
  const isSubmitDisabled = isPending || !isAuthed || punchline.trim().length === 0

  const handleSubmit = async () => {
    if (!isAuthed) return

    try {
      setIsLoading(true)
      const response = await fetchPost("/api/submit-joke", { jokeId: joke.id, punchline })
      if (!response.ok) throw new Error(response.error ?? "Unknown error")
      setUserEntry(response.data as Submission)
      startTransition(() => router.refresh())
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <JokeSetup joke={joke} />
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="text-md font-semibold uppercase tracking-wide bg-yellow-200">
            Your punchline
          </div>
        </header>
        {userEntry == null ? (
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
              <Button disabled={isSubmitDisabled} onClick={handleSubmit}>
                {isPending && <Spinner />}
                Submit
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-1 space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/6" />
          </div>
        )}
      </section>
    </div>
  )
}
