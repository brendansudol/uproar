import { Container } from "@/components/container"
import { Header } from "@/components/header"
import { getTodayISO } from "@/lib/dates"
import { ArchiveCalendar } from "./_components/archive-calendar"

export default function ArchivesPage() {
  const todayISO = getTodayISO()

  return (
    <Container>
      <Header />
      <div className="py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black leading-tight">Archives</h1>
          <p className="text-sm text-muted-foreground">Pick a date to jump to that day’s joke.</p>
        </div>
        <div className="flex justify-center">
          <ArchiveCalendar initialDateISO={todayISO} />
        </div>
      </div>
    </Container>
  )
}
