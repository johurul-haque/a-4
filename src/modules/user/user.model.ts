import { env } from '@config';
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { User, userRoles } from './user.interface';

const userModelSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: userRoles,
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, { password, __v, ...rest }) => rest,
    },
  }
);

userModelSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, env.SALT_ROUNDS);

  await PasswordModel.create({
    user: this._id,
    password: this.password,
    createdAt: new Date(),
  });

  next();
});

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

  const docsToDelete = docs.slice(1);

  for (const doc of docsToDelete) {
    await PasswordModel.findByIdAndDelete(doc._id);
  }

  next();
});

export const UserModel = model('user', userModelSchema);
export const PasswordModel = model('password', passwordModelSchema);