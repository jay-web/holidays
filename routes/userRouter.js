const express = require("express");
const {
  getAllUsers,
  getUser,
  getMe,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getUploadPhoto,
  resizeUploadPhoto
} = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", authController.signUp);
userRouter.post("/login", authController.login);
userRouter.get("/logout", authController.logout);

userRouter.post("/forgotPassword", authController.forgotPassword);
userRouter.patch("/resetPassword/:token", authController.resetPassword);

// Protect all middleware after this (need to login)
userRouter.use(authController.protect);

userRouter.patch("/updatePassword",  authController.updatePassword);
userRouter.get("/me", getMe, getUser);
userRouter.patch("/updateMe", getUploadPhoto, resizeUploadPhoto, updateMe);
userRouter.delete("/deleteMe", deleteMe);

// Restrict authorization to admin and lead-guide after this
userRouter.use(authController.restrictTo("admin", "lead-guide"));

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);
userRouter.post("/", createUser);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
