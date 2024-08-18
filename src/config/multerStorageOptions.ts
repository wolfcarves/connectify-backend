import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
	destination: '/uploads',
	filename: (req, file, cb) => {
		const userUuid = req.params.uuid;
		cb(null, userUuid + path.extname(file.originalname));
	},
});
