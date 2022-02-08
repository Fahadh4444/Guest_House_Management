var express = require('express');
var router = express.Router();
const { check } = require('express-validator');

const { signup, signin, isSignedIn, signout, verifyEmail, forgotpassword } = require("../controllers/authControllers")
const { getUserById } = require("../controllers/userControllers")

//* (Params)Middlewares
router.param("userId", getUserById);

//* Signup route
router.post(
    "/signup",
    [
        check("email", "email is required").isEmail(),
        check("password", "password sholud be atleast 3 char").isLength({ min: 3 })
    ],
    signup
)

//* Signin Route
router.post(
    "/signin",
    [
        check("email", "email is required").isEmail(),
        check("password", "password is required").isLength({ min: 1 })
    ],
    signin
)

//* Signout Route
router.get(
    "/signout",
    signout
)

//* Verify Email
router.post(
    "/verify-email/:userId",
    verifyEmail
)

//* Forgot Password Route
router.post(
    "/forgotpassword",
    [
        check("email", "email is required").isEmail(),
    ],
    forgotpassword
)

module.exports = router;