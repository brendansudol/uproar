import "dotenv/config"
import fs from "fs"
import path from "path"
import { explainJoke } from "../lib/ai/joke-explainer.ts"
import { generateJokeHelp } from "../lib/ai/joke-helper.ts"

type Joke = {
  id: string
  setup: string
  punchline: string
  tags: string

  // Enriched fields
  help?: string
  explanation?: string

  // Allow extra fields
  [key: string]: unknown
}

type Options = {
  inputPath: string
  outputPath: string
  model: string
  maxRetries: number
  initialBackoffMs: number
  resume: boolean
  overwrite: boolean
}

class RetryableError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const parseArgs = (): Options => {
  const args = process.argv.slice(2)
  const readArg = (flag: string, fallback: string) => {
    const idx = args.findIndex((value) => value === flag || value.startsWith(`${flag}=`))
    if (idx === -1) return fallback
    const value = args[idx]
    if (value.includes("=")) return value.split("=").slice(1).join("=")
    return args[idx + 1] ?? fallback
  }

  const inputPath = path.resolve(process.cwd(), readArg("--input", "src/data/jokes-sample.json"))
  const outputPath = path.resolve(
    process.cwd(),
    readArg("--output", "src/data/jokes-sample.enriched.json"),
  )

  return {
    inputPath,
    outputPath,
    model: readArg("--model", process.env.JOKES_MODEL ?? "gpt-5.1"),
    maxRetries: Number(readArg("--max-retries", "2")),
    initialBackoffMs: Number(readArg("--backoff-ms", "1000")),
    resume: !args.includes("--no-resume"),
    overwrite: args.includes("--overwrite"),
  }
}

const readJson = <T>(filePath: string): T => {
  const raw = fs.readFileSync(filePath, "utf8")
  return JSON.parse(raw) as T
}

const persist = (filePath: string, data: Joke[]) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

const isRetryable = (error: unknown) => {
  if (error instanceof RetryableError) return true

  const status = (error as { status?: number }).status
  if (typeof status === "number" && (status === 408 || status === 429 || status >= 500)) {
    return true
  }

  const code = (error as { code?: string }).code
  if (
    typeof code === "string" &&
    ["ETIMEDOUT", "ECONNRESET", "EAI_AGAIN", "ENETUNREACH"].includes(code)
  ) {
    return true
  }

  return false
}

const callWithRetry = async <T>(fn: () => Promise<T>, options: Options): Promise<T> => {
  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const retryable = isRetryable(error)
      if (!retryable || attempt === options.maxRetries) {
        throw error
      }

      const delay =
        options.initialBackoffMs * Math.max(1, Math.pow(2, attempt - 1)) +
        Math.floor(Math.random() * 200)

      console.warn(
        `Attempt ${attempt} failed (${(error as Error).message}). Retrying in ${delay}ms...`,
      )

      await sleep(delay)
    }
  }

  throw new Error("Exhausted retries")
}

const requireNonEmpty = (value: string, field: string) => {
  if (!value || !value.trim()) {
    throw new RetryableError(`Model returned empty ${field}`)
  }
  return value.trim()
}

const fetchHelp = (joke: Joke, options: Options) =>
  callWithRetry(async () => {
    const { help } = await generateJokeHelp({
      setup: joke.setup,
      punchline: joke.punchline,
      tags: joke.tags,
      model: options.model,
    })
    return requireNonEmpty(help, "help")
  }, options)

const fetchExplanation = (joke: Joke, options: Options) =>
  callWithRetry(async () => {
    const { explanation } = await explainJoke({
      setup: joke.setup,
      punchline: joke.punchline,
      model: options.model,
    })
    return requireNonEmpty(explanation, "explanation")
  }, options)

const main = async () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY")
    process.exit(1)
  }

  const options = parseArgs()
  console.log("Run options:", options)

  if (!fs.existsSync(options.inputPath)) {
    throw new Error(`Input file not found at ${options.inputPath}`)
  }

  const jokes = readJson<Joke[]>(options.inputPath)
  const existing =
    options.resume && fs.existsSync(options.outputPath) ? readJson<Joke[]>(options.outputPath) : []
  const existingById = new Map(existing.map((item) => [item.id, item]))

  const result: Joke[] = []

  for (let idx = 0; idx < jokes.length; idx++) {
    const joke = jokes[idx]
    const cached = existingById.get(joke.id)

    if (cached && !options.overwrite && cached.help && cached.explanation) {
      result.push(cached)
      console.log(`Skipping ${joke.id} (${idx + 1}/${jokes.length}) – already enriched`)
      continue
    }

    console.log(`Enriching ${joke.id} (${idx + 1}/${jokes.length})`)

    const help = await fetchHelp(joke, options)
    const explanation = await fetchExplanation(joke, options)

    const enriched = { ...joke, help, explanation }

    result.push(enriched)
    persist(options.outputPath, result)
  }

  persist(options.outputPath, result)
  console.log(`Wrote ${result.length} jokes to ${options.outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
