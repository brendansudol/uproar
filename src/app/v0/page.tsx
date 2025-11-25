import { CircleQuestionMarkIcon, LifeBuoyIcon } from "lucide-react"
import Image from "next/image"
import { AuthButton } from "@/components/auth/auth-button"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Main } from "./_components/main"

export default async function Home() {
  return (
    <Container>
      <header className="mb-8 flex items-center justify-between">
        <Image src="/uproar.png" alt="Uproar" width={180} height={60} priority />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" aria-label="Submit">
            <CircleQuestionMarkIcon />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Submit">
            <LifeBuoyIcon />
          </Button>
          <AuthButton />
        </div>
      </header>
      <Main />
    </Container>
  )
}
