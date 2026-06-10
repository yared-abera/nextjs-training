// components/CreateJobLink.tsx
"use client"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

export default function CreateJobLink() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending || session?.user?.role !== "CLIENT") {
    return null
  }

  return (
    <Link
      href="/jobs/create"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Create Job
    </Link>
  )
}