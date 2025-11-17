"use client"

import { useEffect, useState } from "react"
import { fetchPost } from "@/lib/utils"
import { Submission } from "@/types"

interface Props {
  jokeId: string
}

export function SubmissionsList({ jokeId }: Props) {
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
              <strong>Feedback:</strong> {JSON.stringify(submission.feedback)}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
