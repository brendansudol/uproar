"use client"

import { useEffect, useState } from "react"
import { fetchPost } from "@/lib/utils"
import { Submission } from "@/types"

interface Props {
  jokeId: string
}

export function CommunitySubmissions({ jokeId }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadSubmissions = async () => {
    try {
      setIsLoading(true)
      const data = await fetchPost("/api/get-submissions", { jokeId })
      console.log(data)
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
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="text-md font-semibold uppercase tracking-wide bg-yellow-200">
          Community submissions
        </div>
        <div className="text-sm text-gray-500">{"TODO"}</div>
      </header>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          submissions.map((submission) => (
            <div key={submission.id} className="border p-4 my-2 rounded">
              <div>
                <strong>Setup:</strong> {submission.setup}
              </div>
              <div>
                <strong>Punchline:</strong> {submission.punchline}
              </div>
              <div>
                <strong>Analysis:</strong> {JSON.stringify(submission.analysis)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
