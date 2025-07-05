const User = require('../models/user')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const register = async (req, res, next) => {
    try {
        const result = req.body
        if (!result.email || !result.password || !result.firstName || !result.lastName || !result.phone)
            throw createError.BadRequest("Missing required fields")
        const doesExist = await User.findOne({ email: result.email })
        if (doesExist)
            throw createError.Conflict(`${result.email} is already registered`)
        const newUser = new User(result)
        const savedUser = await newUser.save()
        res.send(savedUser)
    }
    catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            throw createError.BadRequest("missing Required Fileds")
        const user = await User.findOne({ email })
        if (!user)
            throw createError.NotFound(`${email} not registered`)
        const isMatch = await user.isValidPassword(password)
        if (!isMatch)
            throw createError.Unauthorized("Email or password is not valid")

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ token: token })

    }
    catch (err) {
        next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        res.send("logout route")
    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    register,
    login,
    logout
}