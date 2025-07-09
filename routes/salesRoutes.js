const express = require("express")
const verifyToken = require("../middlewares/authMiddlewares")
const authorizeRoles = require("../middlewares/authRoles")
const validateSale = require('../controllers/salesController')
router = express.Router()

router.post("/", verifyToken, authorizeRoles("pharmacist","admin"), validateSale)

module.exports = router 