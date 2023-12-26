import { z } from 'zod';

export const userRoles = ['user', 'admin'] as const;

export const userSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(userRoles),
});

export const userLoginSchema = userSchema.pick({
  username: true,
  password: true,
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type PasswordChangePayload = z.infer<typeof passwordChangeSchema>;

export type TJwtPayload = {
  _id: string;
  role: (typeof userRoles)[number];
  email: string;
};
