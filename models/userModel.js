const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  

const userSchema = new mongoose.Schema({
    firstName:{ 
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique:true,
        lowercase: true,
        required: true
    }, 
    password: {
        type: String, 
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false
    }, 
    phone: {
        type: String, 
        required: true, 
    }, 
    role: {
        type: String, 
        default: 'customer'
    }, 
    avatar: {
        type: String,
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
})

module.exports = mongoose.model('User', userSchema);