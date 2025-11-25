import { notFound } from "next/navigation"
import { Container } from "@/components/container"
import { Header } from "@/components/header"
import { JokeView } from "@/components/joke-view"
import { getJoke } from "@/lib/supabase/queries"

const DATE = "2025-01-05"

export default async function Home() {
  const joke = await getJoke(DATE)

  if (joke == null) return notFound()

  return (
    <Container>
      <Header />
      <JokeView joke={joke} />
    </Container>
  )
}
