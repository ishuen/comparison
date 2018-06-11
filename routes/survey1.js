var express = require('express')
var router = express.Router()
const survey1 = require('../controllers/survey1')

router.get('/:num/:id', survey1.showQuestions)

module.exports = router
