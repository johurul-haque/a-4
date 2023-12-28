import { Schema, model } from 'mongoose';

const passwordModelSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

passwordModelSchema.pre('save', async function (next) {
  const docs = await PasswordModel.find({ user: this.user }).sort({
    createdAt: -1,
  });

  const docsToDelete = docs.slice(2);

  for (const doc of docsToDelete) {
    await PasswordModel.findByIdAndDelete(doc._id);
  }

  next();
});

export const PasswordModel = model('password', passwordModelSchema);
