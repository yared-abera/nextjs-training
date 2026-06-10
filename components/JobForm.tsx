"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  createJobSchema,
  type CreateJobFormValues,
} from "@/lib/validations/job.schema"

export type JobFormData = CreateJobFormValues

type JobFormProps = {
  defaultValues?: JobFormData
  onSubmit: (data: JobFormData) => Promise<void>
  buttonText: string
}

export default function JobForm({
  defaultValues,
  onSubmit,
  buttonText,
}: JobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <input
          placeholder="Job Title"
          className="w-full border p-4 rounded-xl"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          placeholder="Job Description"
          className="w-full border p-4 rounded-xl h-40"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="number"
          placeholder="Budget"
          className="w-full border p-4 rounded-xl"
          {...register("budget", { valueAsNumber: true })}
        />
        {errors.budget && (
          <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
        )}
      </div>

      <button
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-6 py-4 rounded-xl disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : buttonText}
      </button>
    </form>
  )
}