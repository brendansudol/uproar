import { Joke, Submission } from "@/types"

interface Props {
  joke: Joke
  userEntry: Submission
}

export async function JokeComplete({ joke, userEntry }: Props) {
  return (
    <div>
      <div className="font-bold mb-4 text-lg">Joke Complete</div>
      <div className="overflow-auto">
        <pre>{JSON.stringify({ joke, userEntry }, null, 2)}</pre>
      </div>
    </div>
  )
}
