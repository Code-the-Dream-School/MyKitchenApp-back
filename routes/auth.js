const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')

const {login, register, changePassword} = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.patch('/changePassword', auth, changePassword)

module.exports = router