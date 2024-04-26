import { catchAsync, sendResponse } from '@utils';
import * as reviewService from './reviews.service';

export const addReview = catchAsync(async (req, res) => {
  const data = req.body,
    id = req.user._id,
    result = await reviewService.create(data, id);

  sendResponse(res, {
    statusCode: 201,
    message: 'Review created successfully',
    data: result,
  });
});
