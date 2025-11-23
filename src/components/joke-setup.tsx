import { Joke } from "@/types"

interface Props {
  joke: Joke
}

export function JokeSetup({ joke }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="text-md font-semibold uppercase tracking-wide bg-yellow-200">
          Joke Setup
        </div>
        <div className="text-sm text-gray-500">{joke.activeDate}</div>
      </header>
      <p className="text-2xl font-semibold leading-tight text-gray-900 sm:text-2xl">{joke.setup}</p>
    </section>
  )
}
