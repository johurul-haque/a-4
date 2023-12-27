import { env } from '@config';
import { AppError, sendResponse } from '@utils';
import { compare, compareSync, hash } from 'bcrypt';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { startSession } from 'mongoose';
import { PasswordChangePayload, TJwtPayload, User } from './user.interface';
import { PasswordModel, UserModel } from './user.model';
import { formatDate } from './user.utils';

export function register(payload: User) {
  return UserModel.create(payload);
}

export async function login(payload: Pick<User, 'username' | 'password'>) {
  const user = await UserModel.findOne(
    { username: payload.username },
    { createdAt: false, updatedAt: false }
  );

  if (!user) throw new AppError(404, 'Not found', 'User not found');

  const isMatched = await compare(payload.password, user.password);

  if (!isMatched)
    throw new AppError(
      401,
      'Authentication Failed',
      "The provided password does not match the user's stored password. Please try again."
    );

  const jwtPayload = {
    _id: user._id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(jwtPayload, env.JWT_SECRET, {
    expiresIn: '20d',
  });

  return {
    user,
    token,
  };
}

export async function changePassword(
  jwtPayload: TJwtPayload,
  payload: PasswordChangePayload,
  res: Response
) {
  const user = await UserModel.findOne({ _id: jwtPayload._id });

  if (!user)
    throw new AppError(
      404,
      'Not Found',
      'User not found with the provided ID.'
    );

  const isMatched = await compare(payload.currentPassword, user.password);

  if (!isMatched)
    throw new AppError(
      401,
      'Authentication Failed',
      "The provided password does not match the user's stored password. Please try again."
    );

  const previousTwoPasswords = await PasswordModel.find({
    user: user._id,
  }).sort({ createdAt: -1 });

  let lastUsedDate = null;

  const passwordMatchesPrevious = previousTwoPasswords.some((doc) => {
    const isMatched = compareSync(payload.newPassword, doc.password);

    if (isMatched) {
      lastUsedDate = formatDate(doc.createdAt);
      return true;
    }
    return false;
  });

  if (passwordMatchesPrevious) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${lastUsedDate}).`,
      data: null,
    });

    // This empty return statement is necessary to return undefined and check on the controller to not send another response
    return;
  }

  const session = await startSession();

  try {
    session.startTransaction();

    const password = await hash(payload.newPassword, env.SALT_ROUNDS);

    await PasswordModel.create({
      user: jwtPayload._id,
      password,
      createdAt: new Date(),
    });

    const user = await UserModel.findByIdAndUpdate(
      jwtPayload._id,
      {
        password,
      },
      {
        returnOriginal: false,
      }
    );

    await session.commitTransaction();
    await session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
}
