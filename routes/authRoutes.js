const express = require('express')
router = express.Router();
const { register, login, logout } = require('../controllers/authControllers')


router.post('/register', register)

router.post('/login', login)

router.delete('/logout', logout)

module.exports = router;