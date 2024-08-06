import { db } from '@/db/index.ts';
import { users } from '@/models/users.ts';
import { eq } from 'drizzle-orm';

export const findUserByEmail = async (email: string) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
};

export const findUserByUsername = async (username: string) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return user;
};
