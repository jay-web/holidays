// Users Route handlers/controllers
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require('sharp');

const filterRequestBody = (requestBody, ...allowedFields) => {
  const filterRequest = {};
  Object.keys(requestBody).forEach((el) => {
    if (allowedFields.includes(el)) {
      filterRequest[el] = requestBody[el];
    }
  });

  return filterRequest;
};
// * if want to save image direct to filesystem without any process like processing
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users")
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

//  * if want to hold the image on buffer for processing 
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith("image")){
    cb(null, true);
  }else{
    cb(new AppError("Not an image, please upload only images", 400), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.getUploadPhoto = upload.single('photo');

exports.resizeUploadPhoto = (req, res, next) => {
  if(!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat('jpeg')
      .jpeg( {quality: 90})
      .toFile(`public/img/users/${req.file.filename}`);


  next();
}

exports.getAllUsers = factory.getAll(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(201).json({
    status: "success",
    data: {
      user: user,
    },
  });
});

exports.createUser = (req, res, next) => {
  res.status(200).json({
    status: "error",
    message: "To create new user, please use '/users/signup' route",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not created yet",
  });
};

exports.deleteUser = factory.deleteOne(User);

// Middleware handler to update profile only name & email
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. If user try update password from this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not to update password!, Please use '/updatePassword' !!",
        400
      )
    );
  }

  // 2. Filter out unwanter requested field to get updated in document
  const filterRequest = filterRequestBody(req.body, "name", "email");
  if(req.file) filterRequest.photo = req.file.filename;

  // 2. update user document
  const updatedData = await User.findByIdAndUpdate(req.user.id, filterRequest, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedData,
    },
  });
});

// Middleware to deactive user acccount or delete the user
// It will only set user deactive, won't delete data from database

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
