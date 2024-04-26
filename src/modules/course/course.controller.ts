import { AppError, catchAsync, sendResponse } from '@utils';
import { objectId } from './course.interface';
import * as courseServices from './course.service';

export const createCourse = catchAsync(async function (req, res) {
  const id = req.user._id;
  const result = await courseServices.create(req.body, id);

  sendResponse(res, {
    statusCode: 201,
    message: 'Course created successfully!',
    data: result,
  });
});

export const getCourses = catchAsync(async function (req, res) {
  const result = await courseServices.get(req.query);

  sendResponse(res, {
    statusCode: 200,
    message: 'Course retrieved successfully',
    ...result,
  });
});

export const updateCourse = catchAsync(async function (req, res) {
  const courseId = objectId.parse(req.params.courseId),
    data = req.body;

  const result = await courseServices.update(courseId, data);

  if (!result) throw new AppError(404, 'Not Found', 'Course not found');

  sendResponse(res, {
    statusCode: 200,
    message: 'Course updated successfully',
    data: result,
  });
});

export const getCourseWithReviews = catchAsync(async function (req, res) {
  const courseId = objectId.parse(req.params.courseId);

  const result = await courseServices.getWithReviews(courseId);

  sendResponse(res, {
    statusCode: 200,
    message: 'Course with Reviews retrieved successfully',
    data: result,
  });
});

export const getBestCourse = catchAsync(async function (req, res) {
  const result = await courseServices.getCourseWithHighestRating();

  sendResponse(res, {
    statusCode: 200,
    message: 'Best course retrieved successfully',
    data: result,
  });
});
