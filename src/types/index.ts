export interface Submission {
  id: string
  setup: string
  punchline: string
  created_at: string
  feedback: Record<string, unknown>
}
