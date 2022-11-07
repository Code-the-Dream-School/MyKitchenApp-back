const express = require('express')
const router = express.Router()

const {login, register, changePassword} = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.patch('/changePassword', changePassword)

module.exports = router