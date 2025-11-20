import { Joke, Submission } from "@/types"
import { CommunitySubmissions } from "./community-submissions"
import { JokePunchlineFromComedian } from "./joke-punchline-comedian"
import { JokePunchlineFromUser } from "./joke-punchline-user"
import { JokeSetup } from "./joke-setup"

interface Props {
  joke: Joke
  userSubmission: Submission
}

export async function JokeComplete({ joke, userSubmission }: Props) {
  return (
    <div className="space-y-6">
      <JokeSetup joke={joke} />
      <JokePunchlineFromUser submission={userSubmission} />
      <JokePunchlineFromComedian joke={joke} />
      <CommunitySubmissions jokeId={joke.id} />
    </div>
  )
}
