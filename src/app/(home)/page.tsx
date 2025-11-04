"use client"

import Image from "next/image"
import { useEffect, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SAMPLE_JOKES } from "@/lib/sample-data"

export default function Home() {
  const [userPunchline, setUserPunchline] = useState("")
  const [submittedPunchline, setSubmittedPunchline] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const jokeCount = SAMPLE_JOKES.length
  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + jokeCount) % jokeCount)
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % jokeCount)

  const joke = SAMPLE_JOKES[currentIndex % jokeCount]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = userPunchline.trim()
    if (trimmed.length === 0) return
    setSubmittedPunchline(trimmed)
    setIsRevealed(true)
  }

  const handleReveal = () => {
    const trimmed = userPunchline.trim()
    setSubmittedPunchline(trimmed.length > 0 ? trimmed : null)
    setIsRevealed(true)
  }

  useEffect(() => {
    setUserPunchline("")
    setSubmittedPunchline(null)
    setIsRevealed(false)
  }, [currentIndex])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <header className="mb-8 flex items-center justify-between">
          <Image src="/uproar.png" alt="Uproar" width={300} height={100} priority />
          <Button variant="outline">Sign in</Button>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {joke != null ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={goToPrevious}>
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} of {jokeCount}
                </span>
                <Button variant="outline" onClick={goToNext}>
                  Next
                </Button>
              </div>
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900 leading-tight">{joke.setup}</h1>
                {!isRevealed ? (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Textarea
                      value={userPunchline}
                      onChange={(event) => setUserPunchline(event.target.value)}
                      placeholder="Type your punchline here..."
                      aria-label="Your punchline"
                    />
                    <div className="flex flex-wrap justify-end gap-3">
                      <Button variant="outline" type="button" onClick={handleReveal}>
                        Reveal official punchline
                      </Button>
                      <Button type="submit" disabled={userPunchline.trim().length === 0}>
                        Submit punchline
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    {submittedPunchline != null && (
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Your punchline
                        </p>
                        <p className="text-base text-gray-900">{submittedPunchline}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Official punchline
                      </p>
                      <p className="text-base text-gray-900">{joke.punchline}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No jokes available.</p>
          )}
        </div>
      </div>
    </div>
  )
}
