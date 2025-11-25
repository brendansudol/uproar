import { notFound, redirect } from "next/navigation"
import { Container } from "@/components/container"
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
    <Container>
      <Header />
      <JokeView joke={joke} />
    </Container>
  )
}
