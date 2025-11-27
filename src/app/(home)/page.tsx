import { notFound } from "next/navigation"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { Container } from "@/components/container"
import { Header } from "@/components/header"
import { JokeView } from "@/components/joke-view"
import { checkIsAnnouncementBannerDismissed } from "@/lib/cookie-utils"
import { getJoke } from "@/lib/supabase/queries"

const DATE = "2025-01-05"

export default async function Home() {
  const isBannerDismissed = await checkIsAnnouncementBannerDismissed()
  const joke = await getJoke(DATE)

  if (joke == null) return notFound()

  return (
    <Container>
      <Header />
      {!isBannerDismissed && <AnnouncementBanner />}
      <JokeView joke={joke} />
    </Container>
  )
}
