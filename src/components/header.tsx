import Image from "next/image"
import { AboutThis } from "./about-this"
import { AuthButton } from "./auth/auth-button"

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <Image src="/uproar.png" alt="Uproar" width={180} height={60} priority />
      <div className="flex items-center gap-2">
        <AboutThis />
        <AuthButton />
      </div>
    </header>
  )
}
