const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const validateMongodbId = require("../../utils/validateMongodbID");
const Filter = require("bad-words");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");
const blockUser = require("../../utils/isBlock");
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ CREATE POST                                                             │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const createPostCtrl = expressAsyncHandler(async (req, res) => {

	const { _id } = req.user;
	// block user
	blockUser(req.user);
	validateMongodbId(_id);
	// Check for bad words
	const filter = new Filter();
	const isProfane = filter.isProfane(req.body.title, req.body.description);
	// Block user
	if (isProfane) {
		const user = await User.findByIdAndUpdate(_id, {
			isBlocked: true,
		});
		throw new Error(
			'Creating Failed because it contains profane words and you have been blocked'
		);
	}
	//Prevent User if his account is starter account
	if (
		req?.user?.accountType == 'Starter Account' &&
		req?.user?.postCount === 10
	) {
		throw new Error(
			' Starter Account only create ten posts. Get more followers'
		);
	}
	// 1. Get the path to blog icon image
	const blogImgLocalPath = `public/images/posts/${req.files.blogIconImageFileName}`;
	// 2.Upload to cloudinary
	const blogImgUploaded = await cloudinaryUploadImg(blogImgLocalPath);
	// 1. Get the path to banner image
	const bannerImgLocalPath = `public/images/posts/${req.files.blogIconImageFileName}`;
	// 2.Upload to cloudinary
	const bannerImgUploaded = await cloudinaryUploadImg(bannerImgLocalPath);
	try {
		const post = await Post.create({
			...req.body,
			blogImage: blogImgUploaded?.url,
			blogBannerImage:bannerImgUploaded.url,
			user: _id,
		});
		//update user post count
		await User.findByIdAndUpdate(
			_id,
			{ $inc: { postCount: 1 } },
			{ new: true }
		);
		// Remove the saved post images from storage
		fs.unlinkSync(localPath);
		res.json(post);
	} catch (error) {
		res.json(error);
	}
});
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ FETCH ALL POSTS                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
	const hasCategory = req.query.category;
	try {
		// Check if it has a category
		if (hasCategory) {
			const posts = await Post.find({ category: hasCategory })
				.populate("user")
				.populate("comments")
				.sort("-createdAt");
			res.json(posts);
		} else {
			const posts = await Post.find({})
				.populate("user")
				.populate("comments")
				.sort("-createdAt");
			res.json(posts);
		}
	} catch (error) {
		res.json(error);
	}
});
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ FETCH A SINGLE POST                                                     │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try { 
		const post = await Post.findById(id)
			.populate("user")
			.populate("disLikes")
			.populate("likes")
			.populate("comments");
		// update number of views
		await Post.findByIdAndUpdate(
			id,
			{
				$inc: { numViews: 1 },
			},
			{ new: true }
		);
		res.json(post);
	} catch (error) {
		res.json(error);
	}
});
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ UPDATE POSTS                                                            │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const post = await Post.findByIdAndUpdate(
			id,
			{
				...req.body,
				user: req.user?._id,
			},
			{ new: true }
		);
		res.json(post);
	} catch (error) {
		res.json(error);
	}
});
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ DELETE POST                                                             │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const deletePost = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const post = await Post.findByIdAndDelete(id);
		res.json(post);
	} catch (error) {
		res.json(error);
	}
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ LIKES                                                                   │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const toggleAddLikeToPostCtrl = expressAsyncHandler(async (req, res) => {
	//1. Find the post to be liked
	const { postId } = req.body;
	const post = await Post.findById(postId);
	// 2. Find the login user
	const loginUserId = req?.user?._id;
	// 3. Find is this user has liked this post?
	const isLiked = post?.isLiked;
	// 4. Find is this user has disliked this post?
	const alreadyDisliked = post?.disLikes?.find(
		(userId) => userId?.toString() === loginUserId?.toString()
	);
	// 5. remove the user from dislikes array if exists
	if (alreadyDisliked) {
		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$pull: { disLikes: loginUserId },
				isDisliked: false,
			},
			{ new: true }
		);
		res.json(post);
	}
	//Toggle
	//Remove the user if he has liked the post
	if (isLiked) {
		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$pull: { likes: loginUserId },
				isLiked: false,
			},
			{ new: true }
		);
		res.json(post);
	} else {
		// add to likes
		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { likes: loginUserId },
				isLiked: true,
			},
			{ new: true }
		);
		res.json(post);
	}
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ DISLIKES                                                                │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const toggleAddDislikeToPostCtrl = expressAsyncHandler(async (req, res) => {
	//1.Find the post to be disLiked
	const { postId } = req.body;
	const post = await Post.findById(postId);
	// 2. Find the login user
	const loginUserId = req?.user?._id;
	// 3. Check if this user has already dislikes
	const isDisLiked = post?.isDisLiked;
	//4. Check if already like this post
	const alreadyLiked = post?.likes?.find(
		(userId) => userId.toString() === loginUserId?.toString()
	);
	// res.json(post);
	if (alreadyLiked) {
		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$pull: { likes: loginUserId },
				isLiked: false,
			},
			{ new: true }
		);
		res.json(post);
	}
	// Toggle
	if (isDisLiked) {
		// Remove this user from dislikes if already disliked
		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$pull: { disLikes: loginUserId },
				isDisLiked: false,
			},
			{ new: true }
		);
		res.json(post);
	} else {
		// Add this user to dislikes if not in disliked
		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { disLikes: loginUserId },
				isDisLiked: true,
			},
			{ new: true }
		);
		res.json(post);
	}
});

module.exports = {
	createPostCtrl,
	fetchPostsCtrl,
	fetchPostCtrl,
	updatePostCtrl,
	deletePost,
	toggleAddLikeToPostCtrl,
	toggleAddDislikeToPostCtrl,
};
