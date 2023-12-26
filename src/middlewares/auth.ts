import { env } from '@config';
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
      'AuthorizationError',
      'Authorization token is missing. Please provide a valid token'
    );

  jwt.verify(token, env.JWT_SECRET, function (err, decoded) {
    if (err)
      throw new AppError(
        401,
        'AuthorizationError',
        'Failed to verify JWT token. Please provide a valid token.'
      );

    if (decoded && typeof decoded !== 'string') {
      req.user = decoded;
    } else {
      throw new AppError(
        401,
        'AuthorizationError',
        'Invalid JWT token format.'
      );
    }
  });

  next();
});
