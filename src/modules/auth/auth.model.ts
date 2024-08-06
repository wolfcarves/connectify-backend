import { z } from 'zod';
import { registry } from '@/utils/zodToOpenAPI.ts';
import { userSchema } from '../user/user.model.ts';

export const userSignupInput = registry.register(
  'Object',
  userSchema
    .extend({
      confirm_password: z.string().openapi('confirm_password'),
    })
    .openapi('UserSignupInput'),
);

export type UserSignupInput = z.infer<typeof userSignupInput>;
