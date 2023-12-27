import { Schema, model } from 'mongoose';
import { Category } from './category.interface';

const categoryModelSchema = new Schema<Category>(
  {
    name: { type: String, unique: true, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, { __v, ...rest }) => rest,
    },
  }
);

export const CategoryModel = model('category', categoryModelSchema);
