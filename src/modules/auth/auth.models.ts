import { z } from 'zod';
import { registry } from '@/utils/zodToOpenAPI.ts';

export const userSchema = z
  .object({
    email: z.string().openapi('email'),
    username: z.string().openapi('username'),
    password: z.string().openapi('password'),
  })
  .openapi('Object');

registry.register('Object', userSchema);

export type UserSchema = z.infer<typeof userSchema>;
