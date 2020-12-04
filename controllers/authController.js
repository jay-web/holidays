const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createToken = (userId) => {
  return jwt.sign(
    { id: userId, name: "welcome_in_holidays" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Middleware for sign up
exports.signUp = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = createToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

// Middleware for login user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check email & password is available;
  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "PLEASE PROVIDE EMAIL AND PASSWORD",
    });
  }
  //  check email & password is valid;
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // finally send the response with token, if email or password is correct
  const token = createToken(user._id);
  res.status(200).json({
    status: "success",
    token: token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Step 1 = Check whether token available in header or not
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged In. Please login !!!", 401));
  }

  // Step 2 = Verify token
  // * since jwt.verify accept the callback function which after verifying
  // * but we are using async await, so we will convert it into to return a promise
  // * which we can access using await
  // * using build in util module function promisify
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Step 3 == Check whether user still exist or not (user deleted after issuing token)
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belong to sent token doesn't exit!!", 401)
    );
  }

  // Step 4 == Check whether user has changed the password after login(after getting token)
  const passwordChanged = await currentUser.checkPasswordChanged(decoded.iat);
  if (passwordChanged) {
    return next(
      new AppError("User has changed the password, please login again !!!", 401)
    );
  }

  // Finally if above steps are fine, so will grant the access
  req.user = currentUser;
  next();
});
