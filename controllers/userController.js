// Users Route handlers/controllers
const User = require("../models/userModel");
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();

    res.status(201).json({
      status: "success",
      totalUsers: allUsers.length,
      data: {
        users: allUsers,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(201).json({
      status: "success",
      data: {
        user: user
      }
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "This route is not created yet",
    });
  }
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not created yet",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not created yet",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not created yet",
  });
};
