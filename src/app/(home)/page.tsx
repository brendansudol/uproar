import { AuthButton } from "@/components/auth/auth-button"

export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col items-start gap-4">
          <AuthButton />
        </div>
      </div>
    </div>
  )
}
