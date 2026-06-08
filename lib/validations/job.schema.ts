import {z} from 'zod';

export const createJobSchema = z.object({
    title: z.string().min(5,"Title must be at least 5 characters long"),
});