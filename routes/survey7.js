var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:env/:trial/:userId/:algorithm', surveys.newExp2SurveyEnv)

module.exports = router
