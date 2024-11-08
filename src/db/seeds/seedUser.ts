import { faker } from '@faker-js/faker';
import { usersTable } from '@/models/usersTable';
import { db } from '..';

type User = typeof usersTable.$inferInsert;

const seedUserTable = async () => {
	const count = 500;

	const users = faker.helpers.multiple(createRandomUser, {
		count,
	});

	await db.insert(usersTable).values(users);
};

const createRandomUser = (): User => {
	const avatars = [
		'/m_avatar_1.svg',
		'/m_avatar_2.svg',
		'/m_avatar_3.svg',
		'/m_avatar_4.svg',
		'/m_avatar_5.svg',
		'/m_avatar_6.svg',
		'/m_avatar_7.svg',
		'/m_avatar_8.svg',
		'/m_avatar_9.svg',
		'/m_avatar_10.svg',
	];

	const cities = [
		'Manila',
		'Quezon City',
		'Cebu City',
		'Davao City',
		'Cagayan de Oro',
		'Baguio',
		'Zamboanga City',
		'Taguig',
		'Makati',
		'Iloilo City',
		'Pasig',
		'Bacolod',
		'General Santos',
		'Las Piñas',
		'Pasay',
		'Mandaluyong',
		'Parañaque',
		'Marikina',
		'Angeles City',
		'San Juan',
		null,
	];

	const avatar = avatars[Math.floor(Math.random() * 10)];
	const city = cities[Math.floor(Math.random() * 20 + 1)];

	return {
		avatar: avatar,
		username: faker.internet.username(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		city,
		created_at: faker.date.past(),
		updated_at: faker.date.past(),
		is_bot: true,
	};
};

seedUserTable();
