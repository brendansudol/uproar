"use client"

import { HeartIcon, StarIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, fetchPost, parseJokeAnalysis } from "@/lib/utils"
import { Submission } from "@/types"

interface Props {
  showSetup?: boolean
  submission: Submission
}

export function SubmissionEntry({ showSetup = false, submission }: Props) {
  const analysis = parseJokeAnalysis(submission.analysis)

  const [isFavorited, setIsFavorited] = useState(submission.isFavorited ?? false)
  const [isPending, setIsPending] = useState(false)

  const handleFavoriteToggle = async () => {
    if (isPending) return

    const isFavoritedNext = !isFavorited
    setIsFavorited(isFavoritedNext)
    setIsPending(true)

    try {
      const response = await fetchPost("/api/favorite-submission", {
        submissionId: submission.id,
        favorite: isFavoritedNext,
      })

      if (response?.ok !== true) {
        throw new Error(response?.error ?? "Failed to update favorite")
      }
    } catch (error) {
      console.error(error)
      setIsFavorited(!isFavoritedNext)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="rounded-lg border p-3 sm:p-4">
      <div className="flex flex-col gap-3">
        {showSetup && <p className="text-sm">{submission.setup}</p>}
        <p className="text-lg font-semibold leading-snug text-gray-900">{submission.punchline}</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {analysis && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <StarIcon className="size-4" />
                  <span className="font-semibold">{analysis.rating} / 10</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-w-sm space-y-2 text-left leading-relaxed">
                <div className="flex items-center gap-2">
                  <StarIcon className="size-4 fill-amber-300 text-amber-500" />
                  <span className="text-sm font-semibold">
                    Analysis rating: {analysis.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{analysis.commentary}</p>
              </PopoverContent>
            </Popover>
          )}
          <Button
            variant="outline"
            size="icon-sm"
            disabled={isPending}
            onClick={handleFavoriteToggle}
          >
            <HeartIcon className={cn("size-4", isFavorited && "fill-current")} />
          </Button>
        </div>
      </div>
    </div>
  )
}
