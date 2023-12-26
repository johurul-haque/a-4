import { catchAsync, sendResponse } from '@utils';
import { Request, Response } from 'express';
import * as reviewService from './reviews.service';

export const addReview = catchAsync(async (req: Request, res: Response) => {
  const data = req.body,
    result = await reviewService.create(data);

  sendResponse(res, {
    statusCode: 201,
    message: 'Review created successfully',
    data: result,
  });
});
