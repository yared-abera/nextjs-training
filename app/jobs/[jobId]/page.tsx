// app/jobs/[jobId]/page.tsx
import Link from "next/link"
import { notFound } from "next/navigation"
import ApplyJobForm from "@/components/ApplyJobForm"
import JobOwnerActions from "@/components/JobOwnerActions"
import { getSession } from "@/lib/server/session"
import { getApplicationsByJobId, hasApplied } from "@/services/applications.service"
import { getJobById } from "@/services/jobs.service"

export default async function JobPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const job = await getJobById(jobId)

  if (!job) {
    notFound()
  }

  const session = await getSession()
  const user = session?.user
  const isOwner = user?.id === job.clientId
  const isFreelancer = user?.role === "FREELANCER"
  const isClient = user?.role === "CLIENT"

  let applications = null
  let alreadyApplied = false

  if (isOwner) {
    applications = await getApplicationsByJobId(jobId)
  }

  if (isFreelancer && user) {
    alreadyApplied = await hasApplied(jobId, user.id)
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold">{job.title}</h1>
      <p className="mt-4">{job.description}</p>
      <p className="mt-4">Budget: ${job.budget}</p>
      <p className="mt-4 text-gray-600">Posted by: {job.client.name}</p>

      {/* Owner: edit + delete */}
      {isOwner && <JobOwnerActions jobId={job.id} />}

      {/* Guest: prompt to log in */}
      {!user && (
        <p className="mt-8">
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>{" "}
          to apply for this job.
        </p>
      )}

      {/* Freelancer: apply or already applied */}
      {isFreelancer && !alreadyApplied && <ApplyJobForm jobId={job.id} />}
      {isFreelancer && alreadyApplied && (
        <p className="mt-8 text-green-700 font-medium">
          You have already applied to this job.
        </p>
      )}

      {/* Client viewing someone else's job */}
      {!isOwner && isClient && (
        <p className="mt-8 text-gray-600">
          Only freelancers can apply to jobs.
        </p>
      )}

      {/* Owner: applicant list */}
      {isOwner && applications && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            Applications ({applications.length})
          </h2>
          {applications.length === 0 ? (
            <p className="text-gray-500">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <p className="font-semibold">
                    {application.freelancer.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {application.freelancer.email}
                  </p>
                  <p className="mt-2">{application.coverLetter}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}