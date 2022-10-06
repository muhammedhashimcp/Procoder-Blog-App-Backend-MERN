const expressAsyncHandler = require('express-async-handler')
const Category = require("../../model/category/Category");
const validateMongodbId = require('../../utils/validateMongodbID');

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │   Create category                                                       │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const category = await Category.create({
			user: req.user._id,
			title: req.body.title,
		})
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
		// res.json('categoty fetch');
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
	try {
		const category = await Category.findByIdAndUpdate(
			id,
			{
				title: req?.body?.title,
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