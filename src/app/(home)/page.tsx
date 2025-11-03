"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SAMPLE_JOKES } from "@/lib/sample-data"

export default function Home() {
  const jokeCount = SAMPLE_JOKES.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + jokeCount) % jokeCount)
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % jokeCount)
  const joke = SAMPLE_JOKES[currentIndex % jokeCount]

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
                <p className="text-lg text-gray-700">{joke.punchline}</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
                <span>{joke.source}</span>
                {joke.tags ? (
                  <span className="truncate max-w-full sm:max-w-xs text-right">{joke.tags}</span>
                ) : null}
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
