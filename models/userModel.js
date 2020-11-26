const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please mention email id"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']

    },
    photo: [String],
    password: {
        type: String,
        required: [true, "Password is mandatory"],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please enter password again to confirm"],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: "Password are not same !!!"

        }
    }
});

// Middleware to encrypt the user password, before store in db
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;       // just to remove passwordConfirm from database

    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;