const express = require("express");

const userRouter = express.Router();

// Users Route handlers
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}
const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}
const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}
const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not created yet"
    })
}


userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);
userRouter.post("/", createUser);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);


module.exports = userRouter;