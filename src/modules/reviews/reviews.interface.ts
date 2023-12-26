import { Types } from 'mongoose';
import { z } from 'zod';

export const reviewsSchema = z.object({
  courseId: z.custom<Types.ObjectId>(),
  rating: z.number().min(1).max(5),
  review: z.string(),
});

export type Reviews = z.infer<typeof reviewsSchema>;
