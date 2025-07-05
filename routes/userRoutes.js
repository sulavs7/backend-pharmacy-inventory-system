const express = require("express")
const verifyToken = require("../middlewares/authMiddlewares")
const authorizeRoles = require("../middlewares/authRoles")

router = express.Router()

//admin routes 
router.get('/admin', verifyToken, authorizeRoles("admin"), (req, res, next) => {
    res.json({ message: "hello admin" })
})
//user routes
router.get('/user', verifyToken, authorizeRoles("pharmacist", "admin"), (req, res, next) => {
    res.json({ message: "hello user" })
})

module.exports = router;