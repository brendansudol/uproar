import { Auth } from "@/components/user/auth"
import { SignIn } from "@/components/user/sign-in"
import { SignOut } from "@/components/user/sign-out"

export default async function Home() {
  return (
    <div className="flex gap-2">
      <Auth />
      <SignIn />
      <SignOut />
    </div>
  )
}
