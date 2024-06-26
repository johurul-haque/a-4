import { auth } from '@middlewares/auth';
import { validateRequest } from '@middlewares/validate-request';
import { Router } from 'express';
import { addReview } from './reviews.contoller';
import { reviewsSchema } from './reviews.interface';

const router = Router();

router.post('/reviews', [auth('user'), validateRequest(reviewsSchema)], addReview);

export const ReviewsRoutes = router;
