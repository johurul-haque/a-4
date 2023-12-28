import { auth } from '@middlewares/auth';
import { validateRequest } from '@middlewares/validate-request';
import { Router } from 'express';
import { changePassword, loginUser, registerUser } from './user.controller';
import {
  passwordChangeSchema,
  userLoginSchema,
  userSchema,
} from './user.interface';

const router = Router();

router.post('/register', validateRequest(userSchema), registerUser);
router.post('/login', validateRequest(userLoginSchema), loginUser);
router.post(
  '/change-password',
  [auth(), validateRequest(passwordChangeSchema)],
  changePassword
);

export const UserRoutes = router;
