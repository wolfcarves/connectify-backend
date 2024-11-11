import { faker } from '@faker-js/faker';

const seedPostTable = async () => {
	console.log(
		'urlLoremFlickr',
		faker.image.urlLoremFlickr({
			height: 720,
			width: 1280,
		}),
	);
	console.log(
		'urlPicsumPhotos',
		faker.image.urlPicsumPhotos({
			height: 480,
			width: 640,
		}),
	);
	console.log('urlPlaceholder', faker.image.urlPlaceholder());
	console.log('url', faker.image.url());
	console.log('avatar', faker.image.avatar());
	console.log('avatarGitHub', faker.image.avatarGitHub());
};

seedPostTable();
