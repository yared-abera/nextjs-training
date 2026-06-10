import {
  getJobById,
  updateJob,
  deleteJob,
} from "@/services/jobs.service"
import { NextRequest } from "next/server"
import {
  createJobSchema,
} from "@/lib/validations/job.schema"
import { requireJobOwnerFromRequest } from "@/lib/server/session-request"

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      jobId: string
    }>
  }
) {
  try {
    const { jobId } =
      await params

    const job =
      await getJobById(jobId)

    if (!job) {
      return Response.json(
        {
          error:
            "Job not found",
        },
        {
          status: 404,
        }
      )
    }

    return Response.json(job)

  } catch {
    return Response.json(
      {
        error:
          "Failed to fetch job",
      },
      {
        status: 500,
      }
    )
  }
}


// app/api/jobs/[jobId]/route.ts — PUT handler
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params
    
    const ownerResult = await requireJobOwnerFromRequest(request, jobId)
    if ("error" in ownerResult) {
      return ownerResult.error
    }

    const body = await request.json()
    const validated = createJobSchema.safeParse({
      ...body,
      budget: Number(body.budget),
    })

    if (!validated.success) {
      return Response.json(
        { error: validated.error.flatten() },
        { status: 400 },
      )
    }

    const job = await updateJob(jobId, validated.data)
    return Response.json(job)
  } catch (error) {
    console.error("Failed to update job:", error)
    return Response.json(
      { error: "Failed to update job" },
      { status: 500 },
    )
  }
}

// app/api/jobs/[jobId]/route.ts — DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params
    const ownerResult = await requireJobOwnerFromRequest(request, jobId)
    if ("error" in ownerResult) {
      return ownerResult.error
    }

    await deleteJob(jobId)
    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to delete job:", error)
    return Response.json(
      { error: "Failed to delete job" },
      { status: 500 },
    )
  }
}