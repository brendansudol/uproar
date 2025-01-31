"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { isToday as isTodayFn } from "@/utils/dates"
import { useMemo } from "react"

const START_DATE_ISO = "2025-01-01"

interface Props {
  dateISO: string
}

export function DateNav({ dateISO }: Props) {
  const router = useRouter()

  const date = useMemo(() => DateTime.fromISO(dateISO), [dateISO])
  const isToday = isTodayFn(dateISO)

  const goToDay = (dayDelta: number) => () => {
    const nextDateISO = date.plus({ days: dayDelta }).toISODate()
    router.push(`/TODO/${nextDateISO}`)
  }

  return (
    <div>
      <div className="flex">
        <div>
          <div>{date.toFormat("DD")}</div>
        </div>
        <div className="flex">
          <Button disabled={dateISO === START_DATE_ISO} onClick={goToDay(-1)}>
            <ChevronLeft size={26} />
          </Button>
          <Button disabled={isToday} onClick={goToDay(1)}>
            <ChevronRight size={26} />
          </Button>
        </div>
      </div>
    </div>
  )
}
