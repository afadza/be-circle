import * as multer from "multer";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "src/uploads"); 
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const UploadImage = multer({ storage: storage });

export default UploadImage;