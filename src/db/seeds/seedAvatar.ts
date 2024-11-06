import { db } from '..';
import { avatarTable } from '../../models/avatarTable';

const seedAvatarTable = async () => {
	const data: (typeof avatarTable.$inferInsert)[] = [];

	for (let i = 1; i <= 10; i++) {
		data.push({
			id: i,
			avatar: `/m_avatar_${i}.svg`,
		});
	}

	for (let i = 11; i <= 20; i++) {
		data.push({
			id: i,
			avatar: `/f_avatar_${i}.svg`,
		});
	}

	await db.insert(avatarTable).values(data);
};

seedAvatarTable();
