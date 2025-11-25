import type { ReactNode } from "react"

type ContainerProps = {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">{children}</div>
    </div>
  )
}
