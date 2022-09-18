const expressAsyncHandler = require("express-async-handler");
const blockUser = require("../../utils/isBlock");
const Comment = require("../../model/comment/Comment");
const Post = require("../../model/post/Post");
const validateMongodbId = require("../../utils/validateMongodbID");


/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Create comments                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
	// 1.Get the user
	const user = req.user
	// check if user is blocked
	blockUser(user)

	// 2.Get the post Id
	const { postId, description } = req.body;
	try {
		const comment = await Comment.create({
			post: postId,
			user,
			description: description
		})
		res.json(comment);
	} catch (error) {
		res.json(error);
	}

})

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Fetch comments                                                          │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const comments = await Comment.find({}).sort("-created")
		res.json(comments);
	} catch (error) {
		res.json(error);
	}
})

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Comment details                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id)
	try {
		const comment = await Comment.findById(id)
		res.json(comment);
	} catch (error) {
		res.json(error);
	}
})

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Comment update                                                          │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const update = await Comment.findByIdAndUpdate(id, {
			user: req?.user,
			description: req?.body?.description
		},
			{
				new: true,
				runValidators: true
			})
		res.json(update);
	} catch (error) {
		res.json(error);
	}
})
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Delete comment                                                          │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
	const {id } = req.params;
	validateMongodbId(id)
	try {
		const comment = await Comment.findByIdAndDelete(id);
		res.json(comment);
	} catch (error) {
		res.json(error);
	}
})
module.exports = {
	createCommentCtrl,
	fetchAllCommentsCtrl,
	fetchCommentCtrl,
	updateCommentCtrl,
	deleteCommentCtrl
}