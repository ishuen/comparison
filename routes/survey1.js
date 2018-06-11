var express = require('express')
var router = express.Router()
const survey1 = require('../controllers/survey1')

router.get('/', survey1.showQuestionsModValue)
module.exports = router
