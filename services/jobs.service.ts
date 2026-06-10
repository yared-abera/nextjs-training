import { prisma } from "@/lib/db";

type CreateJobData = {
  title: string;
  description: string;
  budget: number;
  clientId: string;
};

export async function createJob(data: CreateJobData) {
  return prisma.job.create({
    data
  });
}

export async function getJobs() {
  return prisma.job.findMany({
    include: {
      client: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getJobById(jobId: string) {
  return prisma.job.findUnique({
    where: {
      id: jobId
    },
    include: {
      client: true,
      applications: true
    }
  });
}

export async function updateJob(
  jobId: string,
  data: {
    title?: string;
    description?: string;
    budget?: number;
  }
) {
  return prisma.job.update({
    where: {
      id: jobId
    },
    data
  });
}

export async function deleteJob(jobId: string) {
  return prisma.job.delete({
    where: {
      id: jobId
    }
  });
}


// services/jobs.service.ts — add at bottom
export async function getJobOwnerId(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { clientId: true },
  })
  return job?.clientId ?? null
}