import { CircleQuestionMarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AboutThis() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon-sm">
            <CircleQuestionMarkIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>About Uproar</DialogTitle>
            <DialogDescription>TODO: subheading</DialogDescription>
          </DialogHeader>
          <div>TODO: main content</div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
