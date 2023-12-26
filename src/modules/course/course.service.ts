import { CategoryModel } from '@modules/category/category.model';
import { ReviewsModel } from '@modules/reviews/reviews.model';
import { AppError } from '@utils';
import { Types } from 'mongoose';
import { Course, Query, Tags } from './course.interface';
import { CourseModel } from './course.model';
import { getDurationInWeeks, mergeArrays, queryBuilder } from './course.utils';

export async function create(payload: Course) {
  const result = await CategoryModel.findById(payload.categoryId);

  if (!result)
    throw new AppError(
      404,
      'Not Found',
      'categoryId does not reference any existing category.'
    );

  return CourseModel.create(payload);
}

export async function get(query: Partial<Query>) {
  const { pipelines, sortBy, page, limit, skip } = queryBuilder(query);

  const data = await CourseModel.aggregate([
    ...pipelines,
    { $skip: skip },
    { $limit: limit },
  ])
    .sort(sortBy)
    .project({ __v: 0 });

  if (data.length) {
    data.forEach((doc: { tags: Tags }) => {
      doc.tags = doc.tags.filter((tag) => !tag.isDeleted);
    });
  }

  return {
    meta: {
      page,
      limit,
      total: data.length,
    },
    data,
  };
}

export async function update(
  courseId: Types.ObjectId,
  payload: Partial<Course>
) {
  const { tags, details, ...rest } = payload,
    modifiedPayload: Record<string, unknown> = { ...rest };

  if (details && Object.keys(details).length) {
    for (const [key, value] of Object.entries(details)) {
      modifiedPayload[`details.${key}`] = value;
    }
  }

  const course = await CourseModel.findById(courseId).lean();

  if (!course) throw new AppError(404, 'Not Found', 'Course not found');

  const startDate = rest.startDate || course.startDate,
    endDate = rest.endDate || course.endDate;

  modifiedPayload['durationInWeeks'] = getDurationInWeeks(startDate, endDate);

  if (tags?.length) {
    // This order must be maintained (tags, course.tags)
    const mergedTags = mergeArrays(tags, course.tags);

    return CourseModel.findOneAndUpdate(
      {
        _id: courseId,
      },
      {
        ...modifiedPayload,
        $set: {
          tags: mergedTags,
        },
      },
      {
        returnOriginal: false,
      }
    );
  }

  return CourseModel.findOneAndUpdate(
    { _id: courseId },
    {
      ...modifiedPayload,
    },
    {
      returnOriginal: false,
    }
  );
}

export async function getWithReviews(courseId: Types.ObjectId) {
  const course = await CourseModel.findById(courseId);

  if (!course) throw new AppError(404, 'Not Found', 'Course not found');

  const reviews = await ReviewsModel.find({ courseId });

  return { course, reviews };
}

export async function getCourseWithHighestRating() {
  const result = await ReviewsModel.aggregate([
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
      },
    },
    {
      $project: {
        _id: 1,
        averageRating: { $round: ['$averageRating', 1] },
      },
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
    {
      $limit: 1,
    },
  ]);

  const reviewCount = await ReviewsModel.countDocuments({
    courseId: result[0]._id,
  });

  const course = await CourseModel.findById(result[0]._id);

  return {
    course,
    averageRating: result[0].averageRating,
    reviewCount,
  };
}
