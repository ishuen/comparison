var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:userId', surveys.showDemographics)

module.exports = router
