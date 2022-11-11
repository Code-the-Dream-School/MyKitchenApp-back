const express = require('express')
const router = express.Router()

const {login, register, removeUser} = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/remove/:id', removeUser)

module.exports = router