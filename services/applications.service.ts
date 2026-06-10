// services/applications.service.ts
import { prisma } from "@/lib/db"

type CreateApplicationData = {
  jobId: string
  freelancerId: string
  coverLetter: string
}

export async function createApplication(data: CreateApplicationData) {
  return prisma.application.create({
    data,
    include: {
      freelancer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  })
}

export async function getApplicationsByJobId(jobId: string) {
  return prisma.application.findMany({
    where: { jobId },
    include: {
      freelancer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function hasApplied(jobId: string, freelancerId: string) {
  const application = await prisma.application.findUnique({
    where: {
      freelancerId_jobId: {
        freelancerId,
        jobId,
      },
    },
  })
  return Boolean(application)
}

export async function getApplicationByFreelancerAndJob(
  jobId: string,
  freelancerId: string,
) {
  return prisma.application.findUnique({
    where: {
      freelancerId_jobId: {
        freelancerId,
        jobId,
      },
    },
  })
}