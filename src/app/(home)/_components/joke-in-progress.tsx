"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { fetchPost } from "@/lib/utils"
import { Joke, Submission } from "@/types"
import { JokeSetup } from "./joke-setup"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SignInButton } from "@/components/auth/sign-in-button"

interface Props {
  joke: Joke
}

export function JokeInProgress({ joke }: Props) {
  const punchlineStorageKey = `joke-${joke.id}-punchline`
  const [punchline, setPunchline] = useState("")
  const [userEntry, setUserEntry] = useState<Submission>()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  // Restore any stored punchline draft after returning from OAuth.
  useEffect(() => {
    if (typeof window === "undefined") return
    const storedPunchline = window.localStorage.getItem(punchlineStorageKey)
    if (storedPunchline != null && storedPunchline.length > 0) {
      setPunchline(storedPunchline)

      // Focus the submit button to make it easy to continue.
      const frame = requestAnimationFrame(() => submitButtonRef.current?.focus())
      return () => cancelAnimationFrame(frame)
    }
  }, [punchlineStorageKey])

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await fetchPost("/api/submit-joke", { jokeId: joke.id, punchline })
      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(punchlineStorageKey, punchline)
          }
          setIsAuthDialogOpen(true)
          return
        }
        throw new Error(response.error ?? "Unknown error")
      }
      setUserEntry(response.data as Submission)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(punchlineStorageKey)
      }
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
              <Button variant="outline">Need hint?</Button>
              <Button
                ref={submitButtonRef}
                disabled={punchline.length === 0 || isLoading}
                onClick={handleSubmit}
              >
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

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to submit</DialogTitle>
            <DialogDescription>
              You need an account to submit punchlines and keep your drafts safe. Sign in and your
              punchline will be waiting for you when you return.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <SignInButton />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
