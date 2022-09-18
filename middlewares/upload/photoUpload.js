const multer = require("multer")
const sharp = require('sharp')
const path=require('path')
// storage
const multerStorage = multer.memoryStorage();

// file type checking

const multerFilter = (req, file, cb) => {
	// Check file type

	if (file.mimetype.startsWith("image")) {
		cb(null, true)
	} else {
		// rejected files
		cb({
			message: "Unsupported file format",
		},
			false
		);
	}
}

const photoUpload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
	limits: { fileSize: 1000000 }
})

// image Resizing
const profilePhotoResize =async (req, res, next) => {
	// check if there is no file
	if (!req.file) return next()

	req.file.fileName = `user-${Date.now()}-${req.file.originalname}`
	// next()
	await sharp(req.file.buffer).resize(250, 250).toFormat("jpeg").jpeg({ quality: 90 }).toFile(path.join(`public/images/profile/${req.file.fileName}`));
	next()
}

// Post image Resizing
const postImgResize = async (req, res, next) => {
	// check if there is no file
	if (!req.file) return next()

	req.file.fileName = `user-${Date.now()}-${req.file.originalname}`
	// next()
	await sharp(req.file.buffer).resize(500, 500).toFormat("jpeg").jpeg({ quality: 90 }).toFile(path.join(`public/images/posts/${req.file.fileName}`));
	next()
}

module.exports = { photoUpload, profilePhotoResize, postImgResize }