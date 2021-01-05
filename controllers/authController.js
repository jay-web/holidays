const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const crypto = require("crypto");

const createToken = (userId) => {
  return jwt.sign(
    { id: userId, name: "welcome_in_holidays" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const sendToken = (user, res, statusCode) => {
  const token = createToken(user.id);

  // To prevent CROSS SITE SCRIPTING XSS ATTACKS,
  // Storing jwt in httpOnly cookies

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
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
    role: req.body.role,
  });
  
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log({url});
  if(process.env.NODE_ENV === "development"){
    await new Email(newUser, url).sendWelcome();
  }
  
  sendToken(newUser, res, 201);
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
  sendToken(user, res, 200);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "logged out", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Step 1 = Check whether token available in header or not
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  req.user = currentUser; // !  Very important passing the
  // ! user to the request to get used in later middleware
  res.locals.user = currentUser;

  next();
});

exports.isLoggedIn = async (req, res, next) => {
  // Step 1 = Check whether token available in header or not
  if (req.cookies.jwt) {
    try {
      // Step 2 = Verify token
      // * since jwt.verify accept the callback function which after verifying
      // * but we are using async await, so we will convert it into to return a promise
      // * which we can access using await
      // * using build in util module function promisify
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Step 3 == Check whether user still exist or not (user deleted after issuing token)
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // Step 4 == Check whether user has changed the password after login(after getting token)
      const passwordChanged = await currentUser.checkPasswordChanged(
        decoded.iat
      );
      if (passwordChanged) {
        return next();
      }

      // Finally if above steps are fine, so will grant the access
      // !  Very important passing the user to the request to get used in later middleware
      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// Middlware to restrict the authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to run this action !!!", 403)
      );
    }

    return next();
  };
};

// Middleware to handle forget password request

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on email passed by user
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError("Email is not valid or registered with us !!!", 404)
    );
  }

  // Generate the random reset token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });


  // Send the email
  try {
    const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/resetPassword/${resetToken}`;
    if(process.env.NODE_ENV === "development"){
      await new Email(user, resetURL).resetPasswordEmail();
    }
    

    res.status(201).json({
      status: "success",
      message: "Email send successfully",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Something went wrong", 500));
  }
});

// Middleware to handlw resetPassword request

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 Get the user based on token
  const freshToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: freshToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // 2 If the user is exist, and token is not expired, reset the password
  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  // 3 Update changepasswordAt property for the user
  // ! Step 3 occur in user model

  // 4 log in user, send jwt
  sendToken(user, res, 200);
});

// Middleware to handle update password request if user already login

exports.updatePassword = catchAsync(async function (req, res, next) {
  // Get the user from collection
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("You are not logged in !!!. Please login", 401));
  }

  // Check the passed old password is correct or not
  const correct = await user.correctPassword(
    req.body.oldPassword,
    user.password
  );

  if (!correct) {
    return next(
      new AppError("Old password is not correct, please try again", 403)
    );
  }

  // If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Finally logged in user again, send jwt
  sendToken(user, res, 200);
});
