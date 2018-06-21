var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:num/:id', surveys.showQuestions)
module.exports = router
