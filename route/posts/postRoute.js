const express = require('express');
const postRoute = express.Router();

const authMiddleware = require('../../middlewares/auth/authMiddleware');
const {
	photoUpload,
	bannerImgResize,
	postImgResize,
} = require('../../middlewares/upload/photoUpload');
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
	toggleAddDisLikeToPostCtrl,
	toggleAddSavePostCtrl,
	savePostCtrl,
	fetchSavedPostCtrl,
	toggleReportPostCtrl,
	fetchReportedPostCtrl,
} = require('../../controllers/posts/postCtrl');
// } = require("../../controllers/posts/postCtrl");

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ POST ROUTES                                                             │
  └─────────────────────────────────────────────────────────────────────────┘
 */
		postRoute.post(
			'/',
			authMiddleware,
			photoUpload.fields([
				{ name: 'blogBannerImage', maxCount: 1 },
				{ name: 'blogIconImage', maxCount: 1 },
			]),
			bannerImgResize,
			postImgResize,
			createPostCtrl
		);
postRoute.get('/', fetchPostsCtrl);
postRoute.put('/likes', authMiddleware, toggleAddLikeToPostCtrl);
postRoute.put('/toggle-save', authMiddleware, savePostCtrl);
postRoute.put('/dislikes', authMiddleware, toggleAddDisLikeToPostCtrl);
postRoute.get('/saved-list', authMiddleware, fetchSavedPostCtrl);
postRoute.post('/report-post', authMiddleware, toggleReportPostCtrl);
postRoute.get('/reported-list', authMiddleware, fetchReportedPostCtrl);

postRoute.get('/:id', fetchPostCtrl);
postRoute.put('/:id', authMiddleware, updatePostCtrl);
postRoute.delete('/:id', authMiddleware, deletePost); 

module.exports = postRoute;
