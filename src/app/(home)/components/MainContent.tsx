"use client"

import { fetchPost } from "@/lib/utils"

interface Props {
  jokeId: string
}

export function MainContent({ jokeId }: Props) {
  const handleSubmit = async () => {
    try {
      const data = await fetchPost("/api/submit-punchline", {
        jokeId,
        punchline: "Uh... this is a sliding door",
      })
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div>main content</div>
      <button onClick={handleSubmit}>submit punchline</button>
    </div>
  )
}
