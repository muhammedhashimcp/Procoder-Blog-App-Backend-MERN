const User = require("../../model/user/User");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const validateMongodbId = require("../../utils/validateMongodbID");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");
const blockUser = require("../../utils/isBlock");
const { sendMailHelper } = require("../../utils/sendMailHelper");
const nodemailer = require("nodemailer");
require("dotenv").config();
const hbs = require("nodemailer-express-handlebars");


/****
 * Register
 ****/
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
	//business logic
	//Check if user Exist
	const userExists = await User.findOne({ email: req?.body?.email });
	if (userExists) throw new Error("User already exists");
	try {
		const user = await User.create({
			firstName: req?.body?.firstName,
			lastName: req?.body?.lastName,
			email: req?.body?.email,
			password: req?.body?.password,
		});
		res.json(user)
	} catch (error) {
		res.json({ error: error });
	}
});
/*
  ┌────────────────────────────────────────────────────────────────────────────┐
  │            login user controller                                           │
  └────────────────────────────────────────────────────────────────────────────┘
 */
const userLoginCtrl = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body;
	//check if user exists
	const userFound = await User.findOne({ email });
	if (userFound?.isBlocked) {
		throw new Error("Access Denied You have been blocked");
	}
	//Check if password is match
	const isMatched = await userFound.isPasswordMatched(password);
	if (userFound && isMatched) {
		res.json({
			_id: userFound?._id,
			firstName: userFound?.firstName,
			lastName: userFound?.lastName,
			email: userFound?.email,
			profilePhoto: userFound?.profilePhoto,
			isAdmin: userFound?.isAdmin,
			token: generateToken(userFound?._id),
			isVerified: userFound?.isAccountVerified,
		});
	} else {
		res.status(401);
		throw new Error(`Login credentials are not valid`);
	}
});
/*********
 * USERS                 *
 *********/
const fetchUserCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const users = await User.find({}).populate("posts");
		res.json(users);
	} catch (error) {
		res.json(error);
	}
});
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Delete user                                                             │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	//check if user id is valid
	validateMongodbId(id);
	try {
		const deleteUser = await User.findByIdAndDelete(id);
		res.json(deleteUser);
	} catch (error) {
		res.json(error);
	}
});
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ User Details                                                            │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	//check if user id is valid
	validateMongodbId(id);
	try {
		const user = await User.findOne({ id });
		res.json(user);
	} catch (error) {
		res.json(error);
	}
});
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ User profile                                                            │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const userProfileCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	// 1. Find the login user
	// 2. Check this particular user if the login user exists in the array of viewedBy

	// get the login user
	const loginUserId = req?.user?._id?.toString();
	try {
		const myProfile = await User.findById(id)
			.populate("posts")
			.populate("viewedBy");

		const alreadyViewed = myProfile?.viewedBy?.find((user) => {
			return user._id?.toString() === loginUserId;
		});
		if (alreadyViewed) {
			res.json(myProfile);
		} else {
			const profile = await User.findByIdAndUpdate(myProfile?._id, {
				$push: { viewedBy: loginUserId },
			});
			res.json(profile);
		}
	} catch (error) {
		res.json(error);
	}
});
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Update User profile                                                     │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
	// Prevent  user if blocked
	blockUser(req?.user);
	const { _id } = req?.user;
	validateMongodbId(_id);
	const user = await User.findByIdAndUpdate(
		_id,
		{
			firstName: req?.body?.firstName,
			lastName: req?.body?.lastName,
			email: req?.body?.email,
			bio: req?.body?.bio,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	res.json(user);
});
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ update User password                                                    │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongodbId(_id);
	const { password } = req.body;
	// Find the user by id
	const user = await User.findById(_id);
	if (password) {
		user.password = password;
		const updatedUser = await user.save();
		res.json(updatedUser);
	} else {
		res.json(user);
	}
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Following                                                               │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const followingUserCtrl = expressAsyncHandler(async (req, res) => {
	//1.Find the user you want to follow and update it's followers field
	const { followId } = req.body;
	const loginUserId = req.user.id;
	//Find the target user and check if the login id exist
	const targetUser = await User.findById(followId);
	const alreadyFollowing = targetUser?.followers?.find(
		(user) => user?.toString() === loginUserId.toString()
	);
	if (alreadyFollowing) throw new Error("You already follow this user");
	await User.findByIdAndUpdate(
		followId,
		{
			$push: { followers: loginUserId },
			isFollowing: true,
		},
		{ new: true }
	);
	// 2. Update the login user following field
	await User.findByIdAndUpdate(
		loginUserId,
		{
			$push: { following: followId },
			// isFollowing: true,
		},
		{ new: true }
	);
	res.json("You have successfully follow this user");
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ UnFollow                                                                │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const unFollowUserCtrl = expressAsyncHandler(async (req, res) => {
	//1.Find the user you want to unFollow and update it's followers field
	const { unFollowId } = req.body;
	const loginUserId = req.user.id;
	await User.findByIdAndUpdate(
		unFollowId,
		{
			$pull: { followers: loginUserId },
			isFollowing: false,
		},
		{ new: true }
	);
	await User.findByIdAndUpdate(
		loginUserId,
		{
			$pull: { following: unFollowId },
		},
		{ new: true }
	);

	res.json("You have successfully unFollow this user ");
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Block User                                                              │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const blockUserCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	const user = await User.findByIdAndUpdate(
		id,
		{
			isBlocked: true,
		},
		{ new: true }
	);
	res.json(user);
});

const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	const user = await User.findByIdAndUpdate(
		id,
		{
			isBlocked: false,
		},
		{ new: true }
	);
	res.json(user);
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Generate Email Verification token                                      │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
	const { to, from, subject, message, resetURL } = req.body;

	// Step 1
	// transporter is what going to connect you to whichever host domain that using or either services that you'd like to
	// connect
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
	});

	const loginUserId = req.user.id;
	const user = await User.findById(loginUserId);
	try {
		// Generate token
		const verificationToken = await user?.createAccountVerificationToken();
		// save user
		await user.save();
		//build your message
		const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>`;
		let mailOptions = {
			from: "procoderblogapp@gmail.com",
			to: "cpmohdhashim@gmail.com",
			subject: "Verify Your Account",
			message: "verify your account now",
			html: resetURL,
		};
		// step 3
		transporter.sendMail(mailOptions, function (err, data) {
			if (err) {
				console.log("Error Occurs", err);
			} else {
				console.log("Email sent!!!!!!!!!");
			}
		});
		res.json(resetURL);
	} catch (error) {
		res.json(error);
	}
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │   Account Verification                                                  │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
	const { token } = req.body;
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
	// Find this user by token
	const userFound = await User.findOne({
		accountVerificationToken: hashedToken,
		accountVerificationTokenExpires: { $gt: new Date() },
	});
	if (!userFound) throw new Error("Token expired, try again later");
	//update the property to true
	userFound.isAccountVerified = true;
	userFound.accountVerificationToken = undefined;
	userFound.accountVerificationTokenExpires = undefined;
	await userFound.save();
	res.json(userFound);
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Forget token generator                                                  │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const forgetPasswordToken = expressAsyncHandler(async (req, res) => {
	// find the user by email
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) throw new Error("User not found");
	try {
		const token = await user.createPasswordResetToken();
		await user.save();
		//build your message
		const resetURL = `If you were requested to reset your password, reset now within 10
		minutes, otherwise ignore this message <a href="http://localhost:3000/
		reset-password/${token}"> Click Here to reset </a>`;
		const msg = {
			to: email,
			from: "twentekghana@gmail.com",
			subject: "Reset Password",
			html: resetURL,
		};
		res.json({
			msg: `A verification message is successfully sent to ${user?.email}. Reset now within 10 minutes, ${resetURL}`,
		});
	} catch (error) {
		res.json(error);
	}
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Password reset                                                          │
  └─────────────────────────────────────────────────────────────────────────┘
 */

const passwordResetCtrl = expressAsyncHandler(async (req, res) => {
	const { token, password } = req.body;
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
	// Find this yser by token
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	if (!user) throw new Error("Token Expired, try again later");
	user.password = password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	res.json(user);
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Profile Photo upload                                                    │
  └─────────────────────────────────────────────────────────────────────────┘
 */
const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res) => {
	// check user blocked or not
	// 1. Get the path to img
	const localPath = `public/images/profile/${req.file.fileName}`;
	// 2.Upload to cloudinary
	const imgUploaded = await cloudinaryUploadImg(localPath);
	//3. Find the login user
	const { _id } = req.user;
	const foundUser = await User.findByIdAndUpdate(
		_id,
		{
			profilePhoto: imgUploaded?.url,
		},
		{ new: true }
	);
	// Remove the saved profile photo from storage
	fs.unlinkSync(localPath);
	res.json(foundUser);
});

module.exports = {
	userRegisterCtrl,
	userLoginCtrl,
	fetchUserCtrl,
	deleteUserCtrl,
	fetchUserDetailsCtrl,
	userProfileCtrl,
	updateUserCtrl,
	updateUserPasswordCtrl,
	followingUserCtrl,
	unFollowUserCtrl,
	blockUserCtrl,
	unBlockUserCtrl,
	generateVerificationTokenCtrl,
	accountVerificationCtrl,
	forgetPasswordToken,
	passwordResetCtrl,
	profilePhotoUploadCtrl,
};
