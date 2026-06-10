"use client"

import { useRouter }
  from "next/navigation"

import JobForm,
{
  JobFormData
}
from "./JobForm"
// components/EditJobForm.tsx — add import and use on failure
import { formatApiError } from "@/lib/format-api-error"



export default function EditJobForm({
  jobId,
  job,
}: {
  jobId: string
  job: JobFormData
}) {
  const router =
    useRouter()

  async function updateJob(
    data: JobFormData
  ) {
    const response =
      await fetch(
        `/api/jobs/${jobId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        }
      )

    if (!response.ok) {
      const body = await response.json()
      alert(formatApiError(body.error))
      return
    }

    router.push(`/jobs/${jobId}`)
  }

  return (
    <JobForm
      defaultValues={job}
      onSubmit={updateJob}
      buttonText="Update Job"
    />
  )
}