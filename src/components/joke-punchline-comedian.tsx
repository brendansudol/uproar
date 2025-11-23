import { LaughIcon } from "lucide-react"
import { Joke } from "@/types"

interface Props {
  joke: Joke
}

export function JokePunchlineFromComedian({ joke }: Props) {
  if (joke.punchline == null) return null

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="text-md font-semibold uppercase tracking-wide bg-yellow-200">
          Comedian’s Punchline
        </div>
        <div className="text-sm text-gray-500">{"TODO"}</div>
      </header>
      <p className="text-2xl font-semibold leading-tight text-gray-900 sm:text-2xl">
        {joke.punchline}
      </p>
      <div className="mt-5 border-l-4 border-sky-400 bg-sky-50 p-4 dark:border-sky-500 dark:bg-sky-500/10 rounded-r-md">
        <div className="flex">
          <div className="shrink-0">
            <LaughIcon className="size-5 text-sky-400 dark:text-sky-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-sky-700 dark:text-sky-300">
              {JSON.stringify(joke.commentary ?? { commentary: "No commentary available" })}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
