import { validateRequest } from '@/middlewares/validate-request';
import { auth } from '@middlewares/auth';
import { Router } from 'express';
import {
  createCourse,
  getBestCourse,
  getCourseWithReviews,
  getCourses,
  updateCourse,
} from './course.controller';
import { courseSchema } from './course.validation';

const router = Router();

router.post(
  '/courses',
  [auth('admin'), validateRequest(courseSchema)],
  createCourse
);
router.get('/courses', getCourses);
router.put(
  '/courses/:courseId',
  [auth('admin'), validateRequest(courseSchema.deepPartial())],
  updateCourse
);
router.get('/courses/:courseId/reviews', getCourseWithReviews);
router.get('/course/best', getBestCourse);


export const CourseRoutes = router;
