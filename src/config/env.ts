import { z } from 'zod';

const envSchema = z.object({
	nodeEnv: z.enum(['production', 'development']),
	port: z.number(),
	databaseUri: z.string(),

	cloudinaryUrl: z.string(),
	cloudinaryCloudName: z.string(),
	cloudinaryCloudApiKey: z.string(),
	cloudinaryCloudApiSecret: z.string(),
	cloudinaryProfilePublicID: z.string(),

	defaultAvatarName: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;

const envValues: EnvSchema = {
	nodeEnv: process.env.NODE_ENV! as 'production' | 'development',
	port: Number(process.env.PORT),
	databaseUri: process.env.DATABASE_URI!,

	cloudinaryUrl: process.env.CLOUDINARY_URL!,
	cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME!,
	cloudinaryCloudApiKey: process.env.CLOUDINARY_CLOUD_API_KEY!,
	cloudinaryCloudApiSecret: process.env.CLOUDINARY_CLOUD_API_SECRET!,
	cloudinaryProfilePublicID: process.env.CLOUDINARY_PROFILE_PUBLIC_ID!,

	defaultAvatarName: process.env.DEFAULT_AVATAR_NAME!,
};

export const env = envSchema.safeParse(envValues).data;
