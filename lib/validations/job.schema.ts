import { z } from "zod";


export const createJobSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),
  budget: z
    .number().min(50, "Minimum budget is 50")
});



export type CreateJobFormValues = z.infer<typeof createJobSchema>

