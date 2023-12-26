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

export type User = z.infer<typeof userSchema>;
