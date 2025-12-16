import Link from "next/link"
import { AboutThis } from "./about-this"
import { AuthButton } from "./auth/auth-button"
import { EmojiSvg } from "./emoji-svg"

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link
          href="/"
          className="flex items-center text-[40px] font-black leading-none tracking-wider"
          aria-label="Uproar wordmark"
        >
          <span>UPR</span>
          <EmojiSvg className="inline-block size-12 -ml-[2px] -mr-[4px] origin-center rotate-60" />
          <span>AR</span>
        </Link>
        <div className="text-sm">A daily joke challenge</div>
      </div>
      <div className="flex items-center gap-2">
        <AboutThis />
        <AuthButton />
      </div>
    </header>
  )
}
