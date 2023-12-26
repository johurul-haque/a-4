import { CourseModel } from '@modules/course/course.model';
import { AppError } from '@utils';
import { Reviews } from './reviews.interface';
import { ReviewsModel } from './reviews.model';

export async function create(payload: Reviews) {
  const result = await CourseModel.findById(payload.courseId);

  if (!result)
    throw new AppError(
      404,
      'Not Found',
      'courseId does not reference any existing course.'
    );

  return ReviewsModel.create(payload);
}
