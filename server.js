const express = require("express");
const dotenv = require('dotenv').config()      
// db import
const dbConnect = require('./config/db/dbConnect')
//Route imports
const userRoutes = require("./route/users/usersRoute");
const postRoutes = require("./route/posts/postRoute");
const commentRoutes = require("./route/comments/commentRoute")
const emailMsgRoutes = require("./route/emailMsg/emailMsgRoute")   
const categoryRoutes=require("./route/category/categoryRoute")

//middleware  imports

const cors=require('cors')
const morgan = require('morgan')   


//custom middleware imports
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");

//2.Middleware Usage

// middleware
const app = express();
app.use(cors())
dbConnect();

// combined /dev/tiny/ short/ common
app.use(morgan('dev'))
app.use(express.json())


//router
app.use('/api/users', userRoutes)
//Posts route
app.use('/api/posts', postRoutes)
//comments route
app.use('/api/comments', commentRoutes)
//Email message  route
app.use('/api/email', emailMsgRoutes)
//Category  route
app.use('/api/category', categoryRoutes)


//Error Handler
app.use(notFound)
app.use(errorHandler)


//server
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is Running at PORT ${PORT}`));
