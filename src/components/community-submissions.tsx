"use client"

import { FrownIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { fetchPost } from "@/lib/utils"
import { Submission } from "@/types"
import { SubmissionEntry } from "./submission-entry"

interface Props {
  jokeId: string
}

export function CommunitySubmissions({ jokeId }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSubmissions = async () => {
    try {
      setIsLoading(true)
      const data = await fetchPost("/api/get-submissions", {
        jokeId,
        excludeCurrentUser: true,
      })
      setSubmissions(data.data as Submission[])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSubmissions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div className="text-md font-semibold uppercase tracking-wide bg-yellow-200">
          Community submissions
        </div>
        {isLoading && (
          <div className="text-sm text-gray-500">
            <Spinner className="size-5" />
          </div>
        )}
      </header>
      {!isLoading && (
        <div className="space-y-3">
          {submissions.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FrownIcon />
                </EmptyMedia>
                <EmptyTitle>No results</EmptyTitle>
                <EmptyDescription>
                  No community submissions yet. Please check back later.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="sm" onClick={loadSubmissions}>
                  Refresh
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            submissions.map((submission) => (
              <SubmissionEntry key={submission.id} submission={submission} />
            ))
          )}
        </div>
      )}
    </section>
  )
}
