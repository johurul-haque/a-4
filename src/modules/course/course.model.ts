import { Schema, model } from 'mongoose';
import { getDurationInWeeks } from '../course/course.utils';
import { Course, courseLevels } from './course.interface';

const tagSchema = new Schema({
  name: { type: String, required: true },
  isDeleted: { type: Boolean, required: true },
});

const courseModelSchema = new Schema<Course>({
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
  durationInWeeks: { type: Number, required: true, default: 0 },
  details: {
    level: {
      type: String,
      enum: courseLevels,
      required: true,
    },
    description: { type: String, required: true },
  },
});

courseModelSchema.pre('save', function (next) {
  this.durationInWeeks = getDurationInWeeks(this.startDate, this.endDate);

  next();
});

courseModelSchema.set('toJSON', {
  transform: (doc, { __v, tags, ...rest }) => {
    const filteredTags = tags.filter(
      (tag: { isDeleted: boolean }) => !tag.isDeleted
    );

    return { ...rest, tags: filteredTags };
  },
});

export const CourseModel = model('course', courseModelSchema);
