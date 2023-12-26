import { validateRequest } from '@/middlewares/validate-request';
import { Router } from 'express';
import {
  createCourse,
  getBestCourse,
  getCourseWithReviews,
  getCourses,
  updateCourse,
} from './course.controller';
import { courseSchema } from './course.interface';

const router = Router();

router.post('/course', validateRequest(courseSchema), createCourse);
router.get('/courses', getCourses);
router.put(
  '/courses/:courseId',
  validateRequest(courseSchema.deepPartial()),
  updateCourse
);
router.get('/courses/:courseId/reviews', getCourseWithReviews);
router.get('/course/best', getBestCourse);


export const CourseRoutes = router;
