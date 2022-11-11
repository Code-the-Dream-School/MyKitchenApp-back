const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')

const {login, register, removeUser} = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.delete('/remove', auth, removeUser)

module.exports = router