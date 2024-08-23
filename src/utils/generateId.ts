export const generateId = () => {
	const startId = BigInt('999999');
	const endId = BigInt('9223372036854775807');

	const range = endId - startId + BigInt(1);
	const randomBigInt = BigInt.asUintN(
		64,
		BigInt(Math.floor(Math.random() * Number(range))),
	);
	const id = startId + (randomBigInt % range);
	const generatedId = id.toString();

	return parseInt(generatedId);
};
