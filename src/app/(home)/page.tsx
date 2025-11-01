import Image from "next/image"
import { Button } from "@/components/ui/button"

const MOCK_DATA = {
  date: "2025-01-01",
  joke: {
    id: "8725b414-b760-4742-8c72-480f82ced287",
    setup: "Knock knock. Who's there?",
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <header className="mb-8 flex items-center justify-between">
          <Image src="/uproar.png" alt="Uproar" width={300} height={100} priority />
          <Button variant="outline">Sign in</Button>
        </header>
        <pre>{JSON.stringify(MOCK_DATA, null, 2)}</pre>
      </div>
    </div>
  )
}
