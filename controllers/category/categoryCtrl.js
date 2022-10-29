const expressAsyncHandler = require('express-async-handler')
const Category = require("../../model/category/Category");
const validateMongodbId = require('../../utils/validateMongodbID');
const cloudinaryUploadImg = require('../../utils/cloudinary');



/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │   Create category                                                       │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
	//Check if Category Exist
	console.log("🚀 ~ file: categoryCtrl.js ~ line 17 ~ createCategoryCtrl ~ req?.body", req?.file)
	const categoryExists = await Category.findOne({ title: req?.body?.title });
	if (categoryExists) throw new Error('Category already exists');

	// 1. Get the path to img
	const localPath = `public/images/category/${req.file.categoryImageFileName}`;
	// 2.Upload to cloudinary
	const categoryImgUploaded = await cloudinaryUploadImg(localPath); 

	try {
		const category = await Category.create({
			user: req.user._id,
			title: req.body.title,
			categoryImage: categoryImgUploaded?.url,
		});
		// Remove the saved profile photo from storage
		fs.unlinkSync(localPath);
		res.json(category);
	} catch (error) {
		res.json(error);
	}
})


/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Fetch all category                                                      │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const fetchCategoriesCtrl = expressAsyncHandler(async (req, res) => {
	try {
		// res.json('category fetch');
		const categories = await Category.find({})
			.populate("user")
			.sort("-createdAt")
		res.json(categories);
	} catch (error) {
		res.json(error);

	}
})

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Fetch a category                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const fetchCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id)
	try {
		// res.json('category fetch');
		const categories = await Category.findById(id)
			.populate("user")
			.sort("-createdAt")
		res.json(categories);
	} catch (error) {
		res.json(error);

	}
})

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ update category                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	//Check if Category Exist
	const categoryExists = await Category.findOne({ title: req?.body?.title });
	if (categoryExists) throw new Error('Category already exists');

	// 1. Get the path to img
	let localPath = ''
	let categoryImgUploaded=''
	if (req.file) {
		localPath = `public/images/category/${req?.file?.categoryImageFileName}`;
	 categoryImgUploaded = await cloudinaryUploadImg(localPath);
	}
	// 2.Upload to cloudinary
	let updatedImage = ''
	if (categoryImgUploaded) {
		updatedImage=categoryImgUploaded?.url
	} else {
		updatedImage=categoryExists?.categoryImage 
	}
	try {
		const category = await Category.findByIdAndUpdate(
			id,
			{
				title: req?.body?.title,
				categoryImage: updatedImage
			},
			{
				new: true,
				runValidators: true,
			}
		);

		res.json(category);
	} catch (error) {
		res.json(error);
	}
})


/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Delete category                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const deleteCategory = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const category = await Category.findByIdAndDelete(id)
		res.json(category);
	} catch (error) {
		res.json(error);
	}
})
module.exports = {
	createCategoryCtrl,
	fetchCategoriesCtrl,
	fetchCategoryCtrl,
	updateCategoryCtrl,
	deleteCategory

}