import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";

import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import {handleValidationErrors, checkAuth} from './utils/index.js'

import {UserController, PostController} from './controllers/index.js'

mongoose
  .connect("mongodb+srv://root:root@cluster0.lwwaurf.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if(!fs.existsSync('uploads')){
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

// Static folder, перенаправляет на папку с изображениями и ищет подходящее по названию
app.use('/uploads', express.static('uploads'));

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


// upload
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`
	});
})

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
