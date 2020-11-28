const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (userId) => {
    return jwt.sign(
        {id: userId, name: "welcome_in_holidays"}, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
        );
}

// Middleware for sign up
exports.signUp = async (req, res) => {
    try{
        // const newUser = await User.create(req.body);

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = createToken(newUser._id);

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

// Middleware for login user
exports.login = async (req, res) => {
    const {email, password } = req.body;

    // check email & password is available;
    if(!email || !password){
       return res.status(400).json({
            status: "failed",
            message: "PLEASE PROVIDE EMAIL AND PASSWORD"
        });
    }

    //  check email & password is valid;
    const user = await User.findOne({email : email}).select("+password");

    if(!user || !(await user.correctPassword(password, user.password))){
        return res.status(401).json({
            status: "failed",
            message: "Incorrect email or password"
        })
    }

    // finally send the response with token, if email or password is correct
    const token = createToken(user._id);
    res.status(200).json({
        status: "success",
        token: token
    })
}

