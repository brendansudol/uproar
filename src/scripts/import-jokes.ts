import "dotenv/config"
import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"
import { DateTime } from "luxon"

const START_DATE = DateTime.fromISO("2025-01-01", { zone: "utc" })

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  const jsonPath = path.join(process.cwd(), "src/data/jokes.json")
  const raw = fs.readFileSync(jsonPath, "utf8")
  const data = JSON.parse(raw)

  const sample = data.slice(0, 10)
  const formatted = sample.map((item: any, idx: number) => {
    return {
      setup: item.setup,
      punchline: item.punchline,
      active_date: START_DATE.plus({ days: idx }).toISODate(),
    }
  })

  const response = await supabase.from("jokes").insert(formatted)
  console.log(response)
}

main()
