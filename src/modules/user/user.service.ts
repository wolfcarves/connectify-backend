import cloudinary from 'cloudinary';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { db } from '@/db';
import { eq, or, getTableColumns, sql, ilike, and, ne } from 'drizzle-orm';
import { env } from '@/config/env';
import { usersTable } from '@/models/usersTable';
import { avatarTable } from '@/models/avatarTable';
import { friendshipsTable } from '@/models/friendsTable';
import { NotFoundException } from '@/exceptions/NotFoundException';

export const getUser = async ({
	userId,
	username,
	email,
	withPassword,
}: {
	userId?: number;
	username?: string;
	email?: string;
	withPassword: boolean;
}) => {
	const { ...columns } = getTableColumns(usersTable);

	const user = (
		await db
			.select({
				...columns,
				...(withPassword ? { password: usersTable.password } : {}),
				friends_count: sql<number>`COUNT(friendships.id)`.as(
					'friends_count',
				),
			})
			.from(usersTable)
			.where(
				or(
					eq(usersTable.id, userId ?? -1),
					eq(usersTable.username, username ?? ''),
					eq(usersTable.email, email ?? ''),
				),
			)
			.leftJoin(
				friendshipsTable,
				or(
					eq(friendshipsTable.user_id, userId ?? -1),
					eq(friendshipsTable.friend_id, userId ?? -1),
				),
			)
			.groupBy(usersTable.id)
			.limit(1)
	)[0];

	return user;
};

export const getUsers = async (
	userId: number,
	search: string,
	page: number,
	perPage: number,
) => {
	const { password, city, is_bot, ...columns } = getTableColumns(usersTable);

	const totalCount = await db
		.select({ count: sql`count(*)`.mapWith(Number) })
		.from(usersTable)
		.then(result => result[0].count);

	const users = await db
		.select(columns)
		.from(usersTable)
		.where(
			and(
				search
					? or(
							ilike(usersTable.name, `%${search}%`),
							ilike(usersTable.username, `%${search}%`),
						)
					: undefined,
				ne(usersTable.id, userId),
			),
		)
		.groupBy(usersTable.id)
		.offset((page - 1) * perPage)
		.limit(perPage);

	if (users.length === 0) throw new NotFoundException('No user found');

	const itemsTaken = users.length;
	const remaining = totalCount - itemsTaken;

	return {
		users,
		total_items: totalCount,
		remaining_items: Math.max(0, remaining),
	};
};

export const uploadUserProfileImage = async (
	userId: number,
	file?: Express.Request['file'],
) => {
	if (!file) throw new BadRequestException('No File Uploaded');

	const avatarId = `version-${file.filename}-avatar-${userId}`;

	const user = (
		await db.select().from(usersTable).where(eq(usersTable.id, userId))
	)[0];

	await cloudinary.v2.uploader.destroy(
		env?.cloudinaryProfilePublicID + '/' + user.avatar,
		{ invalidate: true },
	);

	await cloudinary.v2.uploader.upload(file.path, {
		public_id: avatarId,
		folder: env?.cloudinaryProfilePublicID,
		resource_type: 'image',
	});

	await db
		.update(usersTable)
		.set({
			avatar: avatarId,
		})
		.where(eq(usersTable.id, userId));

	return 'Successfully Uploaded Image';
};

export const deleteUserProfileImage = async (userId: number) => {
	const user = (
		await db.select().from(usersTable).where(eq(usersTable.id, userId))
	)[0];

	await cloudinary.v2.uploader.destroy(
		env?.cloudinaryProfilePublicID + '/' + user.avatar,
		{
			invalidate: true,
		},
	);

	const avatar = (await db.select().from(avatarTable))[0];

	await db
		.update(usersTable)
		.set({
			avatar: avatar?.avatar,
		})
		.where(eq(usersTable.id, userId));
};
