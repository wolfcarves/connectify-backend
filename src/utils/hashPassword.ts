import bcrypt from 'bcrypt';

export default async function hashPassword(password: string) {
	const genSalt = 10;

	const hashedPass = await bcrypt.hash(password, genSalt);

	return hashedPass;
}
