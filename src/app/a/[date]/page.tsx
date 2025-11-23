import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/header"
import { JokeView } from "@/components/joke-view"
import { validateDate } from "@/lib/dates"
import { getJoke } from "@/lib/supabase/queries"

type Params = Promise<{ date: string }>
type Props = { params: Params }

export default async function Page({ params }: Props) {
  const { date } = await params

  const dateISO = validateDate(date)
  if (dateISO == null) return redirect("/")

  const joke = await getJoke(dateISO)
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
