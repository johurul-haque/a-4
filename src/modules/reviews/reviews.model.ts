import { Schema, model } from 'mongoose';
import { Reviews } from './reviews.interface';

const reviewsModelSchema = new Schema<Reviews>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'course',
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, { __v, ...rest }) => rest,
    },
  }
);

export const ReviewsModel = model('reviews', reviewsModelSchema);
