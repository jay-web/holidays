const mongoose = require('mongoose');
const validator = require('validator');

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
        validate: [validator.email, 'Please provide a valid email']

    },
    photo: [String],
    password: {
        type: String,
        required: [true, "Password is mandatory"],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please enter password again to confirm"]
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;