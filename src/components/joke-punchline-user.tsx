import { LaughIcon } from "lucide-react"
import { parseJokeAnalysis } from "@/lib/utils"
import { Submission } from "@/types"

interface Props {
  submission: Submission
}

export function JokePunchlineFromUser({ submission }: Props) {
  const analysis = parseJokeAnalysis(submission.analysis)

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="text-md font-semibold uppercase tracking-wide bg-yellow-200">
          My punchline
        </div>
        <div className="text-sm text-gray-500">{"TODO"}</div>
      </header>
      <p className="text-2xl font-semibold leading-tight text-gray-900 sm:text-2xl">
        {submission.punchline}
      </p>
      {analysis != null && (
        <div className="mt-5 border-l-4 border-sky-400 bg-sky-50 p-4 dark:border-sky-500 dark:bg-sky-500/10 rounded-r-md">
          <div className="flex items-start gap-3">
            <LaughIcon className="mt-0.5 size-5 shrink-0 text-sky-400 dark:text-sky-500" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-100">
                Rating: {analysis.rating} / 10
              </p>
              <p className="text-sm text-sky-700 dark:text-sky-300">{analysis.commentary}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
