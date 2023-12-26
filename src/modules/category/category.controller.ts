import { catchAsync, sendResponse } from '@utils';
import { Request, Response } from 'express';
import * as categoryService from './category.service';

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body,
      result = await categoryService.create(data);

    sendResponse(res, {
      statusCode: 201,
      message: 'Category created successfully',
      data: result,
    });
  }
);

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.get();

  sendResponse(res, {
    statusCode: 200,
    message: 'Categories retrieved successfully',
    data: result,
  });
});
