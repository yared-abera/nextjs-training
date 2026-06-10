// app/jobs/[jobId]/edit/page.tsx
import { notFound, redirect } from "next/navigation"
import EditJobForm from "@/components/EditJobForm"
import { getSession } from "@/lib/server/session"
import { getJobById } from "@/services/jobs.service"

export default async function EditPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const session = await getSession()
  const job = await getJobById(jobId)

  if (!job) {
    notFound()
  }

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.id !== job.clientId) {
    redirect(`/jobs/${jobId}`)
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Edit Job</h1>
      <EditJobForm
        jobId={jobId}
        job={{
          title: job.title,
          description: job.description,
          budget: job.budget,
        }}
      />
    </div>
  )
}