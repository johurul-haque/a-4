import { TJwtPayload } from '@modules/user/user.interface';

declare global {
  namespace Express {
    interface Request {
      user: TJwtPayload;
    }
  }
}
