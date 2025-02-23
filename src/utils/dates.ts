import { DateTime } from "luxon"

const TIME_ZONE = "America/New_York"
const DATE_FORMAT = "yyyy-MM-dd"

export function getTodayISO(): string {
  return DateTime.now().setZone(TIME_ZONE).toFormat(DATE_FORMAT)
}

export function isToday(dateISO: string): boolean {
  return dateISO === getTodayISO()
}

export function isFuture(dateISO: string): boolean {
  return dateISO > getTodayISO()
}

export function parseISO(dateISO: string): DateTime {
  return DateTime.fromISO(dateISO, { zone: TIME_ZONE })
}

export function validateDate(maybeDateISO: string): string | undefined {
  const dateISO = parseISO(maybeDateISO).toISODate()
  return dateISO ?? undefined
}
