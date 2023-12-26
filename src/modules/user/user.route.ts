import { validateRequest } from '@middlewares/validate-request';
import { Router } from 'express';
import { loginUser, registerUser } from './user.controller';
import { userLoginSchema, userSchema } from './user.interface';

const router = Router();

router.post('/register', validateRequest(userSchema), registerUser);
router.post('/login', validateRequest(userLoginSchema), loginUser);

export const UserRoutes = router;
