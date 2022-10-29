const express = require('express');
const categoryRoute = express.Router();
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const {
	createCategoryCtrl,
	fetchCategoriesCtrl,
	fetchCategoryCtrl,
	updateCategoryCtrl,
	deleteCategory

} = require('../../controllers/category/categoryCtrl');
const {
	photoUpload,
	categoryImageResize,
} = require('../../middlewares/upload/photoUpload');

// ,authMiddleware,
categoryRoute.post(
	'/',
	authMiddleware,
	photoUpload.single('categoryImage'),categoryImageResize,
	createCategoryCtrl
);
categoryRoute.get("/", fetchCategoriesCtrl)
categoryRoute.get("/:id",  fetchCategoryCtrl)
categoryRoute.put(
	'/:id',
	photoUpload.single('categoryImage'),
	categoryImageResize,
	updateCategoryCtrl
);
// categoryRoute.put("/:id", authMiddleware,validateCategoryImage, updateCategoryCtrl)
categoryRoute.delete("/:id", authMiddleware, deleteCategory)
 
module.exports = categoryRoute;