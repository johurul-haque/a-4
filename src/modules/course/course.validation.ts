import { z } from "zod";
import { courseLevels, objectId } from "./course.interface";

export const courseSchema = z.object({
    title: z.string(),
    instructor: z.string(),
    categoryId: objectId,
    price: z.number(),
    tags: z.array(
      z.object({
        name: z.string(),
        isDeleted: z.boolean(),
      })
    ),
    startDate: z.string(),
    endDate: z.string(),
    durationInWeeks: z.number().optional(),
    language: z.string(),
    provider: z.string(),
    details: z.object({
      level: z.enum(courseLevels),
      description: z.string(),
    }),
  });