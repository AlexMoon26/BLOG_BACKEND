import express from "express";
import cors from "cors";

import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import {handleValidationErrors, checkAuth} from './utils/index.js'

import {UserController, PostController} from './controllers/index.js'

mongoose
  .connect(process.env.MONGODB_URI)
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




app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
