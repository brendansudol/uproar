import { User } from "@supabase/supabase-js"
import { CircleUserRound } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutMenuItem } from "./sign-out-menu-item"

interface Props {
  user: User
}

export function UserNav({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full text-xs" size="sm" variant="outline">
          <CircleUserRound className="mr-1 h-5 w-5" /> My account
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="font-normal truncate">
            <div className="block text-xs text-gray-500">Signed in as</div>
            <div className="truncate text-sm font-semibold">{user.email}</div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/todo">TODO</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
