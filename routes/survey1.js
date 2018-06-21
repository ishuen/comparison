var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/', surveys.showQuestionsModValue)
module.exports = router
