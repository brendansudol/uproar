import { redirect } from "next/navigation"
import { validateDate } from "@/utils/dates"

type Params = Promise<{ date: string }>
type Props = { params: Params }

export default async function Page({ params }: Props) {
  const { date } = await params
  const dateISO = validateDate(date)

  if (dateISO == null) {
    return redirect("/")
  }

  return <div>stay tuned! ({dateISO})</div>
}
