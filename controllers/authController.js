const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
    try{
        // const newUser = await User.create(req.body);

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = jwt.sign(
            {id: newUser._id, name: "welcome_in_holidays"}, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
            );

        res.status(201).json({
            status: "success",
            token,
            data: {
                user: newUser
            }
        })
    }catch(error){
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

