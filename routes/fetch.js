var express = require('express')
var router = express.Router()
const users = require('../controllers/users')

router.get('/:env', users.oldParticipantLogin)
router.post('/:env', users.oldParticipantPost)

module.exports = router
