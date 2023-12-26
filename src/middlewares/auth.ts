import { env } from '@config';
import { TJwtPayload } from '@modules/user/user.interface';
import { AppError, catchAsync } from '@utils';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const auth = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  if (!token)
    throw new AppError(
      401,
      'Unauthorized Access',
      'You do not have the necessary permissions to access this resource.'
    );

  jwt.verify(token, env.JWT_SECRET, function (err, decoded) {
    if (err)
      throw new AppError(
        401,
        'Unauthorized Access',
        'You do not have the necessary permissions to access this resource.'
      );

    req.user = decoded as TJwtPayload;
  });

  next();
});
