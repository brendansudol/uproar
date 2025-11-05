"use client"

import Image from "next/image"
import { useEffect, useState, type FormEvent } from "react"
import { MessageSquare, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { COMMUNITY_SUBMISSIONS, DEFAULT_ANALYSIS, SAMPLE_JOKES } from "@/lib/sample-data"

export default function Home() {
  const [userPunchline, setUserPunchline] = useState("")
  const [submittedPunchline, setSubmittedPunchline] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const jokeCount = SAMPLE_JOKES.length
  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + jokeCount) % jokeCount)
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % jokeCount)

  const joke = SAMPLE_JOKES[currentIndex % jokeCount]
  const analysisCards = submittedPunchline
    ? buildUserAnalysis(submittedPunchline)
    : DEFAULT_ANALYSIS

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
          <Image src="/uproar.png" alt="Uproar" width={180} height={60} priority />
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
                        Reveal
                      </Button>
                      <Button type="submit" disabled={userPunchline.trim().length === 0}>
                        Submit
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
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
                    <section className="space-y-4 rounded-xl border border-gray-200 p-4 sm:p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-gray-500" />
                          <h2 className="text-lg font-semibold text-gray-900">
                            Top community submissions
                          </h2>
                        </div>
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                          Voting soon
                        </span>
                      </div>
                      <ul className="space-y-4">
                        {COMMUNITY_SUBMISSIONS.map((submission) => (
                          <li
                            key={submission.id}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  by {submission.author}
                                </p>
                                <p className="mt-1 text-base text-gray-900">
                                  {submission.punchline}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled
                                    aria-label={`Upvote submission from ${submission.author}`}
                                  >
                                    <ThumbsUp className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {submission.upvotes}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled
                                    aria-label={`Downvote submission from ${submission.author}`}
                                  >
                                    <ThumbsDown className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {submission.downvotes}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section className="space-y-4 rounded-xl border border-gray-200 p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-gray-500" />
                        <h2 className="text-lg font-semibold text-gray-900">Joke analysis</h2>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        {analysisCards.map((card) => (
                          <div
                            key={card.id}
                            className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              {card.title}
                            </p>
                            <p className="mt-2 text-sm text-gray-900">{card.body}</p>
                          </div>
                        ))}
                      </div>
                    </section>
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

function buildUserAnalysis(punchline: string) {
  const words = punchline.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  return [
    {
      id: "length",
      title: "Delivery length",
      body: `Your ${wordCount}-word punchline is ${
        wordCount > 16 ? "a slow burn" : "snappy"
      }, so tighten the setup or add a pause to let the twist breathe.`,
    },
    {
      id: "surprise",
      title: "Surprise factor",
      body: words.some((word) => /ghost|spirit|boo/i.test(word))
        ? "You echoed the original premise keywords—consider swerving to a totally different domain for stronger surprise."
        : "Nice left turn away from the premise keywords; double down with a vivid image or proper noun.",
    },
    {
      id: "voice",
      title: "Voice & tone",
      body: punchline.endsWith("?")
        ? "Ending on a question keeps the tone conversational—try answering it yourself to land the laugh."
        : "A declarative ending gives confidence; layer in a specific detail (brand, place, name) to sharpen the voice.",
    },
  ]
}
