const authorizeRoles = (...allowedRoles) => {
    try {
        return (req, res, next) => {
            if (!allowedRoles.includes(req.user.role))
                return res.status(403).json({ message: "Access Denied" })
            next()
        }
    }
    catch (err) {
        next(err)
    }

}

module.exports = authorizeRoles;