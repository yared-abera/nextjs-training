// lib/server/session.ts
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getJobById } from "@/services/jobs.service"

export type AppSession = NonNullable<Awaited<ReturnType<typeof getSession>>>

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export async function requireSession() {
  const session = await getSession()
  if (!session?.user) {
    return {
      error: Response.json(
        { error: "You must be logged in" },
        { status: 401 }
      ),
    } as const
  }
  return { session } as const
}

export async function requireRole(allowedRoles: Array<"CLIENT" | "FREELANCER">) {
  const result = await requireSession()
  if ("error" in result) {
    return result
  }
  
  const userRole = result.session.user.role as "CLIENT" | "FREELANCER"
  if (!allowedRoles.includes(userRole)) {
    return {
      error: Response.json(
        { error: "You do not have permission to perform this action" },
        { status: 403 }
      ),
    } as const
  }
  return result
}

export async function requireJobOwner(jobId: string) {
  const result = await requireSession()
  if ("error" in result) {
    return result
  }

  const job = await getJobById(jobId)
  if (!job) {
    return {
      error: Response.json({ error: "Job not found" }, { status: 404 }),
    } as const
  }

  if (job.clientId !== result.session.user.id) {
    return {
      error: Response.json(
        { error: "You can only modify your own jobs" },
        { status: 403 }
      ),
    } as const
  }

  return { session: result.session, job } as const
}