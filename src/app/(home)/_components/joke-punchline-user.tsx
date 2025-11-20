import { Joke, Submission } from "@/types"

interface Props {
  submission: Submission
}

export function JokePunchlineFromUser({ submission }: Props) {
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
    </section>
  )
}
