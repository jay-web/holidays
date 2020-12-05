const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please mention email id"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role:{
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user"
  },
  photo: [String],
  password: {
    type: String,
    required: [true, "Password is mandatory"],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please enter password again to confirm"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not same !!!",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

// Middleware to encrypt the user password, before store in db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; // just to remove passwordConfirm from database

  next();
});

// Instance middlware which we can access in entire document
// * To verify the password sent by user, with the saved password in database
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

// Instance middleware which we can access in entire document
// * To verify whether user has changed the password in meanwhile after login

userSchema.methods.checkPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    let passwordChanged = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < passwordChanged;
  }

  // * false means password has not been changed
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
