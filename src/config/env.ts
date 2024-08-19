import { z } from 'zod';

const envSchema = z.object({
	cloudinaryProfilePublicID: z.string(),
	defaultAvatarName: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;

const envValues: EnvSchema = {
	cloudinaryProfilePublicID: process.env.CLOUDINARY_PROFILE_PUBLIC_ID!,
	defaultAvatarName: process.env.DEFAULT_AVATAR_NAME!,
};

export const env = envSchema.safeParse(envValues).data;
