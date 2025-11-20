import { Joke, Submission } from "@/types"
import { JokeSetup } from "./joke-setup"
import { JokePunchlineFromUser } from "./joke-punchline-user"
import { JokePunchlineFromComedian } from "./joke-punchline-comedian"

interface Props {
  joke: Joke
  userSubmission: Submission
}

export async function JokeComplete({ joke, userSubmission }: Props) {
  return (
    <div className="space-y-6">
      <JokeSetup joke={joke} />
      <JokePunchlineFromUser submission={userSubmission} />
      {joke.punchline != null && <JokePunchlineFromComedian punchline={joke.punchline} />}
    </div>
  )
}
