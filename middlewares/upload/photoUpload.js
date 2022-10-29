const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
// storage
const multerStorage = multer.memoryStorage();

// file type checking

const multerFilter = (req, file, cb) => {
	// Check file type

	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		// rejected files
		cb(
			{
				message: 'Unsupported file format',
			},
			false
		);
	}
};

const photoUpload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
	limits: { fileSize: 1000000 },
});

// image Resizing
const profilePhotoResize = async (req, res, next) => {
	// check if there is no file
	if (!req.file) return next();

	req.file.fileName = `user-${Date.now()}-${req.file.originalname}`;
	// next()
	await sharp(req.file.buffer)
		.resize(250, 250)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(path.join(`public/images/profile/${req.file.fileName}`));
	next();
};

// image Resizing
const cat = async (req, res, next) => {
	// check if there is no file
	if (!req.file) return next();

	req.file.categoryImageFileName = `user-${Date.now()}-${
		req.file.originalname
	}`;
	// next()
	await sharp(req.file.buffer)
		.resize(250, 250)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(
			path.join(
				`public/images/category/${req.file.categoryImageFileName}`
			)
		);
	next();
};

// image Resizing
const categoryImageResize = async (req, res, next) => {
	// check if there is no file
	if (!req.file) return next();

	req.file.categoryImageFileName = `category-${Date.now()}-${
		req.file.originalname
	}`;
	// next()
	await sharp(req.file.buffer)
		.toFormat('jpeg')
		.jpeg({ quality: 100 })
		.toFile(
			path.join(
				`public/images/category/${req.file.categoryImageFileName}`
			)
		);
	next();
};


// validateCategoryImage

// const validateCategoryImage = async (req, res, next) => {
// 	console.log(
// 		'🚀 ~ file: photoUpload.js ~ line 82 ~ validateCategoryImage ~ req',
// 		req.body,req.params
// 	);
// 	// check if there is no file
// 	// if (!req.categoryImage) return next();
// 	if (req.body.categoryImage) {
// 		req.file.categoryImage = req?.body?.categoryImage;
// 		console.log("🚀 ~ file: photoUpload.js ~ line 97 ~ validateCategoryImage ~ req.body.categoryImage", req.file.categoryImage)
// 		photoUpload.single('categoryImage');
// 		categoryImageResize;
// 		return next();
// 	} else {
// 		next();
// 	}
// };

// Banner image Resizing
const bannerImgResize = async (req, res, next) => {
	// check if there is no file
	if (!req.files) return next();

	req.files.bannerImgFileName = `user-${Date.now()}-${
		req.files.blogBannerImage[0].originalname
	}`;
	// next()
	await sharp(req.files.blogBannerImage[0].buffer)
		.resize(1000, 450)
		.toFormat('jpeg')
		.jpeg({ quality: 100 })
		.toFile(
			path.join(`public/images/banner/${req.files.bannerImgFileName}`)
		);
	next();
};
// Banner image Resizing
const profileBannerImageResize = async (req, res, next) => {
	// check if there is no file
	if (!req.files) return next();

	req.files.bannerImgFileName = `user-${Date.now()}-${
		req.files.blogBannerImage[0].originalname
	}`;
	// next()
	await sharp(req.files.blogBannerImage[0].buffer)
		.resize(1000, 450)
		.toFormat('jpeg')
		.jpeg({ quality: 100 })
		.toFile(
			path.join(`public/images/banner/${req.files.bannerImgFileName}`)
		);
	next();
};

// Post image Resizing
const postImgResize = async (req, res, next) => {
	// check if there is no file
	if (!req.files) return next();

	req.files.blogIconImageFileName = `user-${Date.now()}-${
		req.files.blogIconImage[0].originalname
	}`;
	// next()
	await sharp(req.files.blogIconImage[0].buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 100 })
		.toFile(
			path.join(`public/images/posts/${req.files.blogIconImageFileName}`)
		);
	next();
};

module.exports = {
	photoUpload,
	profilePhotoResize,
	bannerImgResize,
	postImgResize,
	categoryImageResize,
	profileBannerImageResize,
};
