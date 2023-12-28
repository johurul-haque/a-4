import { Types } from 'mongoose';
import { z } from 'zod';
import { courseSchema } from './course.validation';

export const courseLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const objectId = z.custom<Types.ObjectId>();

export type Course = z.infer<typeof courseSchema> & {
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