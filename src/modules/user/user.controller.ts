import { catchAsync, sendResponse } from '@utils';
import * as userService from './user.service';

export const registerUser = catchAsync(async function (req, res) {
  const result = await userService.register(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: 'User registered successfully',
    data: result,
  });
});

export const loginUser = catchAsync(async function (req, res) {
  const result = await userService.login(req.body);

  sendResponse(res, {
    statusCode: 200,
    message: 'User login successful',
    data: result,
  });
});

export const changePassword = catchAsync(async function (req, res) {
  const result = await userService.changePassword(req.user, req.body, res);

  if (result) {
    sendResponse(res, {
      statusCode: 200,
      message: 'Password changed successfully',
      data: result,
    });
  }
});
