import { notFound } from "next/navigation"
import { Container } from "@/components/container"
import { Header } from "@/components/header"
import { getJoke } from "@/lib/supabase/queries"
import { Main } from "./_components/main"

const DATE = "2025-01-01"

export default async function Home() {
  const joke = await getJoke(DATE)

  if (joke == null) return notFound()

  return (
    <Container>
      <Header />
      <Main joke={joke} />
    </Container>
  )
}
