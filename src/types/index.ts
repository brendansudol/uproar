export interface Joke {
  id: string
  setup: string
  punchline: string | null
}

export interface Submission {
  id: string
  setup: string
  punchline: string
  created_at: string
  feedback: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
