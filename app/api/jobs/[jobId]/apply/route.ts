// app/api/jobs/[jobId]/apply/route.ts
import { NextRequest } from "next/server"
import { requireRoleFromRequest } from "@/lib/server/session-request"
import { applyJobSchema } from "@/lib/validations/application.schema"
import { createApplication, hasApplied } from "@/services/applications.service"
import { getJobById } from "@/services/jobs.service"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params
    const authResult = await requireRoleFromRequest(request, ["FREELANCER"])
    if ("error" in authResult) {
      return authResult.error
    }

    const { session } = authResult
    const job = await getJobById(jobId)
    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.clientId === session.user.id) {
      return Response.json(
        { error: "You cannot apply to your own job" },
        { status: 403 },
      )
    }

    const alreadyApplied = await hasApplied(jobId, session.user.id)
    if (alreadyApplied) {
      return Response.json(
        { error: "You have already applied to this job" },
        { status: 409 },
      )
    }

    const body = await request.json()
    const validated = applyJobSchema.safeParse(body)
    if (!validated.success) {
      return Response.json(
        { error: validated.error.flatten() },
        { status: 400 },
      )
    }

    const application = await createApplication({
      jobId,
      freelancerId: session.user.id,
      coverLetter: validated.data.coverLetter,
    })

    return Response.json(application, { status: 201 })
  } catch (error) {
    console.error("Failed to apply to job:", error)
    return Response.json(
      { error: "Failed to submit application" },
      { status: 500 },
    )
  }
}