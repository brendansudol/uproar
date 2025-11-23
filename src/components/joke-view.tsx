import { getUserSubmission } from "@/lib/supabase/queries"
import { Joke } from "@/types"
import { JokeComplete } from "./joke-complete"
import { JokeInProgress } from "./joke-in-progress"

interface Props {
  joke: Joke
}

export async function JokeView({ joke }: Props) {
  const userSubmission = await getUserSubmission(joke.id)

  if (userSubmission == null) return <JokeInProgress joke={joke} />
  else return <JokeComplete joke={joke} userSubmission={userSubmission} />
}
