const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const EmailMsg = require("../../model/emailMessaging/EmailMessaging");
const Filter = require("bad-words");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { sendMailHelper } = require("../../utils/sendMailHelper");

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const { to, subject, message } = req.body;
		const msg = {
			to,
			from: process.env.EMAIL,
			subject,
			message,
			sentBy: req?.user?._id,
		};

		const resData = await sendMailHelper(msg);
		//save to our db
		await EmailMsg.create({
			sentBy: req?.user?._id,
			from: req?.user?.email,
			to,
			message,
			subject,
		});
    res.json("Mail sent");

	} catch (error) {
		res.json(error);
	}
});

module.exports = {
	sendEmailMsgCtrl,
};
