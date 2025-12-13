import "dotenv/config"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import { DateTime } from "luxon"
import path from "path"

const START_DATE = DateTime.fromISO("2026-01-01", { zone: "utc" })
const JOKE_FILE = "src/data/jokes-sample.enriched.json"

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  )

  const jsonPath = path.join(process.cwd(), JOKE_FILE)
  const raw = fs.readFileSync(jsonPath, "utf8")
  const data = JSON.parse(raw)
  const sample = data.slice(0, 10)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatted = sample.map((item: any, idx: number) => {
    return {
      setup: item.setup,
      punchline: item.punchline,
      active_date: START_DATE.plus({ days: idx }).toISODate(),
      help: item.help,
      commentary: item.explanation,
    }
  })

  const response = await supabase.from("jokes").insert(formatted)
  console.log(response)
}

main()
