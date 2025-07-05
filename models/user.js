const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    role: {
        type: String,
        enum: ['pharmacist', 'admin'],
        default: 'pharmacist',
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
})
userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    }
    catch (err) {
        next(err)
    }

})
userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)//return boolean 

    }
    catch (error) {
        next(error)
    }
}

module.exports = mongoose.model("User", userSchema)