import { catchAsync, sendResponse } from '@utils';
import * as categoryService from './category.service';

export const createCategory = catchAsync(async (req, res) => {
  const data = req.body,
    id = req.user._id,
    result = await categoryService.create(data, id);

  sendResponse(res, {
    statusCode: 201,
    message: 'Category created successfully',
    data: result,
  });
});

export const getCategories = catchAsync(async (req, res) => {
  const result = await categoryService.get();

  sendResponse(res, {
    statusCode: 200,
    message: 'Categories retrieved successfully',
    data: result,
  });
});
