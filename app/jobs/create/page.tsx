"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import JobForm, { JobFormData } from "@/components/JobForm"
import { authClient } from "@/lib/auth-client"
import { formatApiError } from "@/lib/format-api-error"

export default function CreateJobPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

 // app/jobs/create/page.tsx — useEffect
useEffect(() => {
  if (isPending) {
    return
  }
  if (!session?.user) {
    router.push("/login")
    return
  }
  if (session.user.role !== "CLIENT") {
    router.push("/jobs")
  }
}, [isPending, session, router])

  async function createJob(data: JobFormData) {
    const response = await fetch("/api/jobs", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const body = await response.json()
      alert(formatApiError(body.error))
      return
    }

    router.push("/jobs")
  }

  // app/jobs/create/page.tsx — render guard
if (isPending || !session?.user || session.user.role !== "CLIENT") {
  return null
}

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Create Job</h1>

      <JobForm buttonText="Create Job" onSubmit={createJob} />
    </div>
  )
}
