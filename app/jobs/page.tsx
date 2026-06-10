import Link from "next/link"

import CreateJobLink from "@/components/CreateJobLink"
import { getJobs } from "@/services/jobs.service"

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Available Jobs</h1>

        <CreateJobLink />
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link key={job.id} href={/jobs/${job.id}}>
              <div className="border rounded-lg p-5 hover:bg-gray-50">
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p>Budget: ${job.budget}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}