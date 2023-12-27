import { CourseModel } from '@modules/course/course.model';
import { AppError } from '@utils';
import { Types } from 'mongoose';
import { Reviews } from './reviews.interface';
import { ReviewsModel } from './reviews.model';

export async function create(payload: Reviews, createdBy: Types.ObjectId) {
  const result = await CourseModel.findById(payload.courseId);

  if (!result)
    throw new AppError(
      404,
      'Not Found',
      'courseId does not reference any existing course.'
    );

  return (await ReviewsModel.create({ ...payload, createdBy })).populate({
    path: 'createdBy',
    select: '-createdAt -updatedAt',
  });
}
