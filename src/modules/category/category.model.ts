import { Schema, model } from 'mongoose';
import { Category } from './category.interface';

const categoryModelSchema = new Schema<Category>(
  {
    name: { type: String, unique: true, required: true },
  },
  {
    toJSON: {
      transform: (doc, { __v, ...rest }) => rest,
    },
  }
);

export const CategoryModel = model('category', categoryModelSchema);
