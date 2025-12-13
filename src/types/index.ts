export interface Joke {
  id: string
  setup: string
  punchline: string | null
  commentary: string | null
  activeDate: string | null
  help: string | null
}

export interface Submission {
  id: string
  setup: string
  punchline: string
  createdAt: string
  analysis: any // eslint-disable-line @typescript-eslint/no-explicit-any
  isFavorited?: boolean
}
