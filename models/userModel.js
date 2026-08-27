const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  
const crypto = require('crypto');

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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
}, {
    timestamps: true
});

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt){
        const ChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < ChangedTimestamp;
    }
    return false;
}

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

    console.log({resetToken}, this.passwordResetToken);

    return resetToken;
};

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return ;

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
})

module.exports = mongoose.model('User', userSchema);