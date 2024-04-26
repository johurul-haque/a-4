import { env } from '@config';
import { TJwtPayload } from '@modules/user/user.interface';
import { AppError, catchAsync } from '@utils';
import jwt from 'jsonwebtoken';

export const auth = (role?: 'user' | 'admin') => {
  return catchAsync(async function (req, res, next) {
    try {
      const token = req.headers.authorization;

      if (!token) throw new Error();

      jwt.verify(token, env.JWT_SECRET, function (err, decoded) {
        if (err) throw new Error();

        req.user = decoded as TJwtPayload;

        if (role) {
          if (req.user.role === role) {
            next();
          } else {
            throw new Error();
          }
        } else {
          next();
        }
      });
    } catch (error) {
      throw new AppError(
        401,
        'Unauthorized Access',
        'You do not have the necessary permissions to access this resource.'
      );
    }
  });
};
