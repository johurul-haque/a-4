import { CategoryRoutes } from '@modules/category/category.route';
import { CourseRoutes } from '@modules/course/course.route';
import { ReviewsRoutes } from '@modules/reviews/reviews.route';
import { UserRoutes } from '@modules/user/user.route';
import { Router } from 'express';

const router = Router();

const similarRoutes = [CourseRoutes, ReviewsRoutes];

router.use('/auth', UserRoutes);
router.use('/categories', CategoryRoutes);
router.use('/', similarRoutes);

export default router;
