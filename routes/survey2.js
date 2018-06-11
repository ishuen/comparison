var express = require('express')
var router = express.Router()
const survey2 = require('../controllers/survey1')

router.get('/:num/:id', survey2.showQuestions)
module.exports = router
