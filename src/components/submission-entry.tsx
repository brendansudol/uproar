"use client"

import { HeartIcon, StarIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, fetchPost, parseJokeAnalysis } from "@/lib/utils"
import { Submission } from "@/types"

interface Props {
  submission: Submission
}

export function SubmissionEntry({ submission }: Props) {
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
    <div className="rounded-lg border border-gray-100 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-lg font-semibold leading-snug text-gray-900 sm:text-xl">
          {submission.punchline}
        </p>

        <div className="flex items-center gap-2 sm:pl-4">
          {analysis != null && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="group inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800 shadow-inner outline-none transition hover:-translate-y-[1px] hover:border-amber-300 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-amber-300"
                  tabIndex={0}
                >
                  <StarIcon className="size-4 fill-amber-300 text-amber-500 transition group-hover:scale-110" />
                  <span>{analysis.rating.toFixed(1)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm text-left leading-relaxed">
                {analysis.commentary}
              </TooltipContent>
            </Tooltip>
          )}

          <Button
            variant={isFavorited ? "default" : "outline"}
            size="icon-sm"
            disabled={isPending}
            onClick={handleFavoriteToggle}
            className={cn(
              "border border-rose-200 text-rose-600 hover:bg-rose-50",
              isFavorited && "bg-rose-50 text-rose-700 hover:bg-rose-100",
            )}
          >
            <HeartIcon
              className={cn(
                "size-4",
                isFavorited ? "fill-rose-500 text-rose-600" : "text-rose-500",
              )}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
