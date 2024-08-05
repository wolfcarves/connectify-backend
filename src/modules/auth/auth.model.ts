import { z } from 'zod';
import { registry, generateComponents } from '@/utils/zodToOpenAPI.ts';

export const userSchema = z
  .object({
    email: z.string().openapi('email'),
    username: z.string().openapi('username'),
    password: z.string().openapi('password'),
  })
  .openapi('Object');

registry.register('Object', userSchema);

export type UserSchema = z.infer<typeof userSchema>;

export const userSignupInput = userSchema
  .extend({
    confirm_password: z.string().openapi('confirm_password'),
  })
  .openapi('UserSignupInput');

export type UserSignupInput = z.infer<typeof userSignupInput>;

registry.register('Object', userSignupInput);
