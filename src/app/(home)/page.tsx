import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { JokeView } from "@/components/joke-view"
import { getJoke } from "@/lib/supabase/queries"

const DATE = "2025-01-05"

export default async function Home() {
  const joke = await getJoke(DATE)

  if (joke == null) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Header />
        <JokeView joke={joke} />
      </div>
    </div>
  )
}
