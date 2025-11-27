"use client"

import { XIcon } from "lucide-react"
import { useState } from "react"
import { dismissAnnouncementBanner } from "@/lib/cookie-utils"

export function AnnouncementBanner() {
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = async () => {
    setIsDismissed(true)
    await dismissAnnouncementBanner()
  }

  if (isDismissed) return null

  return (
    <div className="flex items-start justify-between gap-4 bg-gray-900 dark:bg-gray-800 text-white p-4 mb-6 rounded-lg">
      <p className="text-sm">
        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem
        ipsum dolor sit amet.
      </p>
      <button
        type="button"
        className="flex-none p-[2px] hover:cursor-pointer"
        onClick={handleDismiss}
      >
        <XIcon className="size-4" />
      </button>
    </div>
  )
}
