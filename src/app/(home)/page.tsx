import Image from "next/image"
import { Auth } from "@/components/user/auth"
import { SignIn } from "@/components/user/sign-in"
import { SignOut } from "@/components/user/sign-out"
import { getTodayISO } from "@/utils/dates"
import { createClient } from "@/utils/supabase/server"
import { MainContent } from "./components/MainContent"
import { DateNav } from "@/components/date-nav"

export default async function Home() {
  const today = getTodayISO()
  const supabase = await createClient()
  const { data: joke } = await supabase.from("jokes").select("*").eq("active_date", today).single()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image src="/uproar.png" width={300} height={100} alt="Uproar" />
        <div>hello!</div>
        <Auth />
        <SignIn />
        <SignOut />
        <DateNav dateISO={today} />
        <div>
          <div>Today: {today}</div>
          <div>Joke setup: {joke.setup}</div>
        </div>
        <MainContent jokeId={joke.id} />
      </main>
    </div>
  )
}
