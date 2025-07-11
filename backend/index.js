import express from "express";
import fs from "fs";
import multer from "multer";
import cors from "cors";

import mongoose from "mongoose";

import {
  registorValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

import {
  UserController,
  PostController,
  CommentController,
} from "./controllers/index.js";

mongoose
  .connect("mongodb://localhost:27017/blog")
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

//'mongodb://localhost:27017/blog'
//"mongodb+srv://admin:admin@cluster0.8jrrk.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  handleValidationErrors,
  loginValidation,
  UserController.login
);
app.post(
  "/auth/register",
  registorValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts/comments/:id", CommentController.getAll);
app.post("/posts/comments/:id", CommentController.create);
// app.get("/tags", PostController.getLastTags);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts", PostController.getAll);
app.get("/posts/popular", PostController.getPopular);
app.get("/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  handleValidationErrors,
  postCreateValidation,

  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
