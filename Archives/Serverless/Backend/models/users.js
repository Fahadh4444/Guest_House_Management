var mongoose = require("mongoose");

//* User Schema
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        maxlength: 32,
        unique: true
    },
    encry_password: {
        type: String,
        required: true
    },    
    otp: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("User", userSchema);