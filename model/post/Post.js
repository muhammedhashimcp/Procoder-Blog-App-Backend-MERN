const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Post title is required'],
			trim: true,
		},
		//Created by only category
		category: {
			type: String,
			required: [true, 'Post category is required'],
			default: 'All',
		},
		isLiked: {
			type: Boolean,
			default: false,
		},
		isDisLiked: {
			type: Boolean,
			default: false,
		},
		numViews: {
			type: Number,
			default: 0,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		disLikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please Author is required'],
		},
		description: {
			type: String,
			required: [true, 'Post description is required'],
		},
		blogImage: {
			type: String,
		},
		blogBannerImage: {
			type: String,
		},
		reports: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},
		isReported: {
			type: Boolean,
			default: false,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);

//populate comments
postSchema.virtual("comments", {
	ref: "Comment",
	foreignField: "post",
	localField: "_id",
});

//compile
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
