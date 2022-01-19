const User = require('../models/users');
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const { validationResult } = require('express-validator');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

//* Signup Controller
exports.signup = (req, res) => {
    //? Checking Error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    //? Hashing password
    bcrypt.hash(req.body.password,10)
    .then((hash) => {
        //? Adding encrypted password to req
        req.body.encry_password = hash;
        //? Generating random OTP
        const otp = Math.floor(Math.random()*899999+100000);
        req.body.otp = otp;
        const user = new User(req.body);
        //? Saving user indatabase
        user.save((err, user) => {
            //? Case of any error
            if(err){
                return res.status(400).json({
                    error: err,
                    msg: "Error in saving data to database for Not saving!!!!"
                });
            }

            //? Sending OTP to email provided by user
            //TODO
            sgMail.setApiKey(process.env.SENDGRID);
            const message = {
                to: `${req.body.email}`,
                from: {
                    name: 'Fahadh',
                    email: `${process.env.FROM}`
                },
                subject: 'Email Verification',
                text: 'Hello from Fahadh!!!',
                html: `<p>Here is the verification code ${otp}.</p?`
            }
            sgMail
            .send(message)
            .then((response) => {
                //? Sending user data with response
                res.json({
                    name: user.email,
                    id: user._id
                });
            })
            .catch((e) => {
                return res.status(400).json({
                    error: e,
                    msg: "Error in saving data to database at sending OTP!!!"
                });
            })
        });
    })
    .catch((err) => {
        return res.status(400).json({
            error: err,
            msg: "Error in saving data to database at hashing!!!"
        });
    })
};

//* Signin Controller
exports.signin = (req, res) => {
    const {email, password} = req.body;

    //? Checking Error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    //? Fetching user from database using findone
    //? checking email
    User.findOne({email})
    .then((user) => {
        //? Case of user not existing
        if(!user){
            return res.status(400).json({
                error: "User does not exists"
            });
        }
        //? Comaparing the passswords
        bcrypt.compare(password, user.encry_password)
        .then((response) => {
            //? Case of password not matching
            if(!response){
                return res.status(400).json({
                    error: "Password is Incorrect!!!"
                });
            }
            //?Sending token and user details with response
            const token = jwt.sign({ _id: user._id }, 'shhhhh', { algorithm : 'HS256' });
            res.cookie("token", token, { expire: new Date() + 9999 });
            const {email} = user;
            res.json({ token, user: { email } });
        })
        .catch((error) => {
            return res.status(400).json({
                error: error
            });
        })
    })
    .catch((err) => {
        return res.status(400).json({
            error: "User does not exists"
        });
    })

}

//* isSignedIn
exports.isSignedIn = expressJwt({
    secret: 'shhhhh',
    algorithms: ['HS256'],
    userProperty: "auth"
});

//* Singnout Controller
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User Signout successfully"
    });
}

//* Verify Email
exports.verifyEmail = (req,res) => {
    const otp = req.body.otp;
    User.findOne({ _id: req.profile._id }, (err, user) => {
        //? If err and if otp not matches
        if(err || (otp != user.otp)){
            return res.status(400).json({
                result: 0,
                error: err,
                msg: "Error in verifying OTP!!!!!!!"
            });
        }
        //? Updating user verification status in databse
        User.updateOne({ _id : req.profile._id}, {otp : 0, isVerified: true}, (error, u) => {
            if(error){
                return res.status(400).json({
                    result: 0,
                    error: error,
                    msg: "Error in verifying OTP and Updating!!!!!!!"
                });
            }
            res.json({
                result: 1,
                message: "Verified email successfully!!!"
            });

        })
    })
}

//* Forgot Password Contrtoller
exports.forgotpassword = (req, res) => {
    
}