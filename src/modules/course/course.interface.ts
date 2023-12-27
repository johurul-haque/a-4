import { Types } from 'mongoose';
import { z } from 'zod';

export const courseLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const objectId = z.custom<Types.ObjectId>();

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
  language: z.string(),
  provider: z.string(),
  details: z.object({
    level: z.enum(courseLevels),
    description: z.string(),
  }),
});

export type Course = z.infer<typeof courseSchema> & {
  durationInWeeks: number;
  createdBy: Types.ObjectId;
};

export type Tags = {
  name: string;
  isDeleted: boolean;
}[];

const sortBy = [
  'title',
  'price',
  'startDate',
  'endDate',
  'language',
  'duration',
] as const;

export type SortTypes = 'asc' | 'desc';

export type Query = {
  page: string;
  limit: string;
  sortBy: (typeof sortBy)[number];
  sortOrder: SortTypes;
  minPrice: string;
  maxPrice: string;
  tags: string;
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks: string;
  level: (typeof courseLevels)[number];
};