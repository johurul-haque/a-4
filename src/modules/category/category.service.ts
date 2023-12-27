import { UserModel } from '@modules/user/user.model';
import { AppError } from '@utils';
import { Types } from 'mongoose';
import { Category } from './category.interface';
import { CategoryModel } from './category.model';

export async function create(payload: Category, createdBy: Types.ObjectId) {
  const user = await UserModel.findById(createdBy);

  if (!user)
    throw new AppError(
      404,
      'Not Found',
      'adminId does not reference any existing document'
    );

  return CategoryModel.create({ ...payload, createdBy });
}

export function get() {
  return CategoryModel.find().populate({
    path: 'createdBy',
    select: '-createdAt -updatedAt',
  });
}
