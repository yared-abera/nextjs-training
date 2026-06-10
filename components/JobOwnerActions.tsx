// components/JobOwnerActions.tsx
"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

type JobOwnerActionsProps = {
  jobId: string
}

export default function JobOwnerActions({ jobId }: JobOwnerActionsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this job?")
    if (!confirmed) {
      return
    }

    setDeleting(true)
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: "DELETE",
      credentials: "include",
    })
    setDeleting(false)

    if (!response.ok) {
      const body = await response.json()
      alert(body.error ?? "Failed to delete job")
      return
    }

    router.push("/jobs")
    router.refresh()
  }

  return (
    <div className="mt-8 flex gap-3">
      <Link
        href={`/jobs/${jobId}/edit`}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Edit Job
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete Job"}
      </button>
    </div>
  )
}