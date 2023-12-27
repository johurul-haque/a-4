import { Schema, model } from 'mongoose';
import { Course, courseLevels } from './course.interface';

const tagSchema = new Schema({
  name: { type: String, required: true },
  isDeleted: { type: Boolean, required: true },
});

const courseModelSchema = new Schema<Course>(
  {
    title: { type: String, required: true, unique: true },
    instructor: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    price: { type: Number, required: true },
    tags: [
      {
        type: tagSchema,
        required: true,
        _id: false,
      },
    ],
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    language: { type: String, required: true },
    provider: { type: String, required: true },
    durationInWeeks: { type: Number, required: true },
    details: {
      level: {
        type: String,
        enum: courseLevels,
        required: true,
      },
      description: { type: String, required: true },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

courseModelSchema.set('toJSON', {
  transform: (doc, { __v, tags, ...rest }) => {
    const filteredTags = tags.filter(
      (tag: { isDeleted: boolean }) => !tag.isDeleted
    );

    return { ...rest, tags: filteredTags };
  },
});

export const CourseModel = model('course', courseModelSchema);
