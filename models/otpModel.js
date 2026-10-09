const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true
    },
    expireAt: {
        type: Date,
        required: true,
        index: {expires: 0}
    }
}, { timestamps: true });

module.exports = mongoose.model( "OTP", OTPSchema );
