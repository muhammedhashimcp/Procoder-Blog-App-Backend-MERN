
# Procoder Blog App

## Table of contents

- [Introduction](#introduction)
- [Run](#run)
- [Technology](#technology)
- [Features](#features)
- [License](#license)

## Introduction

 Procoder is a Blog website for creating blogs and helpful documentaries for developers. Developers can browse and see the posts and search the doubt topics. users can see Like Dislike comments to the Other Author posts. users can manage their account details by Add Posts, changing profile pictures and profile details, and payment methods for premium. For the permium user, they can create private blogs like a note and they can chat each other. This website has an admin section. Admin can manage users like block, delete, search, etc. admin can manage Users' Blogs, give verification, give premium Access to users, etc.

## Run

### Note:- This repo is the Backend  part of Procoder Blog App 
Backend repo is available here:  [Procoder blog app frontend](https://github.com/muhammedhashimcp/Procoder-Blog-App-Frontend-MERN.git)   

To run this application, you have to set your own environmental variables. For security reasons, some variables have been hidden from view and used as environmental variables with the help of dotenv package. Below are the variables that you need to set in order to run the application:

- JWT_KEY: This is the JWT AuthToken (string).

- SENDER:This is the sender, who sends the mails, used for nodemailer(string)

- EMAIL:This is the email id, used for nodemailer(string)

- PASSWORD : This is the password, used for nodemailer(String)

- CLOUDINARY_CLOUD_NAME : This is the cloud name to store images, Cloudinary(String)

- CLOUDINARY_API_KEY : This is the API Key, Cloudinary(String)

- CLOUDINARY_SECRET_KEY : This is the secret key, Cloudinary(String)

- MONGO_DB : This is the database, Mongo DB(String)


After you've set these environmental variables in the .env file at the root of the project, and intsall node modules using  `npm install` in backend root directory and also install frontend packages by using 'npm install'. 

Now you can run the backend and frontend using `npm start` in the terminal , then the application should work.

## Technology

The application is built with:

- React JS
- Redux Toolkit
- Tailwind CSS
- Node JS
- MongoDB
- Express JS
- Node mailer
- REST API
- Cloudinary

## Features

This application is a Blog website for creating blogs and helpful documentaries for developers. Which displays posts/blogs created by different authors.

Users can do the following:

- Signup with OTP verification using nodemailer.
- User can login using the credentials.
- Through otp verification, the user can manage forgotten passwords.
- Users can change their password and set a new one.
- Users can change their personal info.
- The Topics are split into categories users can select the Topics By Category.
- Loggined user can create posts, like posts, unlike posts add comments.
- User without login can view posts only.
- User can view single post details.
- Users can follow each other.

Admins can do the following:

- The Admin can become a controller of the APP by using the signup option and providing his role-based credentials, which he can later use to log in.
- Admin can log  in using registered credentials username and password, and can also end the  session using the logout button
- Admin can handle user block , unblock and delete.
- Admin can add category, edit category and delete categories.

## License

[![License](https://img.shields.io/:License-MIT-blue.svg?style=flat-square)](http://badges.mit-license.org)

- MIT License
- Copyright 2022 © [MUHAMMED HASHIM CP](https://github.com/muhammedhashimcp)
