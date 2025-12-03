"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { convertISOToDate, convertDateToISO } from "@/lib/dates"

interface Props {
  initialDateISO: string
}

export function ArchiveCalendar({ initialDateISO }: Props) {
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState(
    () => convertISOToDate(initialDateISO) ?? new Date(),
  )

  const handleSelect = (date?: Date) => {
    if (date == null) return
    setSelectedDate(date)
    const dateISO = convertDateToISO(date)
    if (dateISO != null) {
      router.push(`/archives/${dateISO}`)
    }
  }

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      defaultMonth={selectedDate}
      onSelect={handleSelect}
    />
  )
}
