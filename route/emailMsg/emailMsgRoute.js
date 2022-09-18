const express = require("express")
const { sendEmailMsgCtrl } = require("../../controllers/emailMsg/emailMsgCtrl")
const authMiddleware = require("../../middlewares/auth/authMiddleware")

const emailMsgRoutes = express.Router()


emailMsgRoutes.post("/", authMiddleware, sendEmailMsgCtrl)


module.exports = emailMsgRoutes
