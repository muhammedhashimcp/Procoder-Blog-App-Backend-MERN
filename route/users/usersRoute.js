const express = require("express");
// const { userRegisterCtrl } = require("../../controllers/users/usersCtrl");
const {
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
	remindMeLaterCtrl,
	forgetPasswordToken,
	passwordResetCtrl,
	profilePhotoUploadCtrl,
	bannerPhotoUploadCtrl,
} = require('../../controllers/users/userCtrl');
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
	photoUpload,
	profilePhotoResize,
	bannerImgResize,
	profileBannerImageResize,
} = require('../../middlewares/upload/photoUpload');


const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", userLoginCtrl);


userRoutes.put("/profile-photo-upload", authMiddleware, photoUpload.single("image"), profilePhotoResize, profilePhotoUploadCtrl);
userRoutes.put(
	'/profile-banner-photo-upload',
	authMiddleware,
	photoUpload.single('image'),
	profileBannerImageResize,
	bannerPhotoUploadCtrl
);
userRoutes.get("/", authMiddleware, fetchUserCtrl);
userRoutes.put("/password",authMiddleware, updateUserPasswordCtrl)
userRoutes.post("/forget-password-token",  forgetPasswordToken)
userRoutes.put("/reset-password", passwordResetCtrl)
userRoutes.put("/follow", authMiddleware, followingUserCtrl)
userRoutes.put("/un-follow", authMiddleware, unFollowUserCtrl)
//email
userRoutes.post("/generate-verify-email-token", authMiddleware, generateVerificationTokenCtrl)
userRoutes.put("/verify-account", authMiddleware, accountVerificationCtrl)
userRoutes.put('/remind-later', authMiddleware, remindMeLaterCtrl);

userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/", authMiddleware, updateUserCtrl)
userRoutes.delete("/:id", deleteUserCtrl);
userRoutes.get("/:id", fetchUserDetailsCtrl);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl)
userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl)

module.exports = userRoutes;