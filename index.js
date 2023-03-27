import express from "express";
import cors from "cors";

import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import {handleValidationErrors, checkAuth} from './utils/index.js'

import {UserController, PostController} from './controllers/index.js'

mongoose
  .connect("mongodb+srv://root:root@cluster0.lwwaurf.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();



app.use(express.json());
app.use(cors());


// Login
app.post('/auth/login', loginValidation, handleValidationErrors,  UserController.login)
// Registration
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
// About me
app.get('/auth/me', checkAuth, UserController.getMe);

// Tags
app.get('/tags', PostController.getLastTags);
// Posts
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.post('/upload', checkAuth, (req, res) => {
	const data = req.file.originalname;
		let buff = new Buffer(data);
		let base64data = buff.toString('base64');
	res.json({
		url: base64data
	});
})

<<<<<<< HEAD
app.listen(process.env.PORT || 4444, (err) => {
=======

app.listen(4444, (err) => {
>>>>>>> parent of 8f87dc2 (Update index.js)
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
