const express = require('express')
const control = require('../controllers/auth')
const router = express.Router()



router.post('/login', control.login)
router.post('/add', control.add)
// router.post('/veiwhome', control.veiwhome)

module.exports = router