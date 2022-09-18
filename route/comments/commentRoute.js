const express = require('express');
const commentRoutes = express.Router();
const authMiddleware=require("../../middlewares/auth/authMiddleware")
const {
	createCommentCtrl,
	fetchAllCommentsCtrl,
	fetchCommentCtrl,
	updateCommentCtrl,
	deleteCommentCtrl
} = require('../../controllers/comments/commentCtrl');


commentRoutes.post("/", authMiddleware, createCommentCtrl)
commentRoutes.get("/", authMiddleware, fetchAllCommentsCtrl)
commentRoutes.get("/:id", authMiddleware, fetchCommentCtrl)
commentRoutes.put("/:id", authMiddleware, updateCommentCtrl)
commentRoutes.delete("/:id", authMiddleware, deleteCommentCtrl)

module.exports=commentRoutes