import { Header } from "@/components/header"
import { Separator } from "@/components/ui/separator"
import { getTodayISO } from "@/lib/dates"
import { getJoke, getUserSubmission } from "@/lib/supabase/queries"
import { Main } from "./_components/main"

export default async function Home() {
  const today = getTodayISO()

  const joke = await getJoke("2025-01-01")
  const userSubmission = await getUserSubmission(joke.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Header />
        <pre>{JSON.stringify({ joke, userSubmission, today }, null, 2)}</pre>
        <Separator className="my-4" />
        <Main jokeId={joke?.id ?? "TODO"} />
      </div>
    </div>
  )
}
