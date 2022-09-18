const express = require('express')
const postRoute = express.Router();

const authMiddleware = require('../../middlewares/auth/authMiddleware');
const { photoUpload, postImgResize } = require('../../middlewares/upload/photoUpload');
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ POST CONTROLLER FUNCTIONS                                               │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const {
	createPostCtrl,
	fetchPostsCtrl,
	fetchPostCtrl,
	updatePostCtrl,
	deletePost,
	toggleAddLikeToPostCtrl,
	toggleAddDislikeToPostCtrl,
} = require("../../controllers/posts/postCtrl");
// } = require("../../controllers/posts/postCtrl");

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ POST ROUTES                                                             │
  └─────────────────────────────────────────────────────────────────────────┘
 */

postRoute.post('/', authMiddleware, photoUpload.single("image"), postImgResize, createPostCtrl);
postRoute.get("/",fetchPostsCtrl)
postRoute.put("/likes", authMiddleware, toggleAddLikeToPostCtrl)
postRoute.put("/dislikes", authMiddleware, toggleAddDislikeToPostCtrl)
postRoute.get("/:id",fetchPostCtrl)
postRoute.put("/:id", authMiddleware, updatePostCtrl)
postRoute.delete("/:id", authMiddleware, deletePost)

module.exports = postRoute;
