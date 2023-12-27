import { Response } from 'express';

type ResponseOptions<T> = {
  success?: boolean;
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export function sendResponse<T>(res: Response, options: ResponseOptions<T>) {
  res.status(options.statusCode).json({
    success: true,
    ...options,
  });
}
