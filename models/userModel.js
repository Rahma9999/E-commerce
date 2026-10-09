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
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    }, 
    phone: {
        type: String, 
        required: true, 
    }, 
    avatar: {
        type: String,
    },
    passwordConfirm: {
        type: String,
        validate: {
            //this use only with create and save!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    role: {
        type: String,
        enum: ['guest', 'user', 'admin'],
        default: 'user'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    verified: {
        type: Boolean,
        default: false,
    },
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

    return resetToken;
};

userSchema.pre('save', async function() {
    if(!this.isModified('password')) return ;

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    
    // Invalidate tokens issued before the change (1s back so the new JWT stays valid)
    if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
});

userSchema.pre(/^find/, function() {
    if (!this.getOptions().includeInactive) this.find({ active: { $ne: false } });
})


module.exports = mongoose.model('User', userSchema);