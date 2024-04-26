import { catchAsync } from '@utils';
import { AnyZodObject } from 'zod';

export function validateRequest(schema: AnyZodObject) {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync(req.body);

    next();
  });
}
