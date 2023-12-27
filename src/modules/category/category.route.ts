import { auth } from '@middlewares/auth';
import { validateRequest } from '@middlewares/validate-request';
import { Router } from 'express';
import { createCategory, getCategories } from './category.controller';
import { categorySchema } from './category.interface';

const router = Router();

router.get('/', getCategories);
router.post(
  '/',
  [auth('admin'), validateRequest(categorySchema)],
  createCategory
);

export const CategoryRoutes = router;
