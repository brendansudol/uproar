import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage() {
  return (
    <div className="p-3 flex flex-col items-center justify-center space-y-4 h-screen">
      <div className="max-w-md text-center">
        <strong>Sorry!</strong> We couldn’t finish signing you in. Please try again soon.
      </div>
      <Button size="sm" variant="outline" asChild>
        <Link href="/">Go to homepage</Link>
      </Button>
    </div>
  )
}
