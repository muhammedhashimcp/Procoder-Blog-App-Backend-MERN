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


categoryRoute.post("/",authMiddleware,createCategoryCtrl)
categoryRoute.get("/", fetchCategoriesCtrl)
categoryRoute.get("/:id",  fetchCategoryCtrl)
categoryRoute.put("/:id", authMiddleware, updateCategoryCtrl)
categoryRoute.delete("/:id", authMiddleware, deleteCategory)

module.exports = categoryRoute;