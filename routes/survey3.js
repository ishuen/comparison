var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:userId', surveys.showDemographics)
router.get('/sg/:userId', surveys.showDemographicsIVLE)
router.get('/int/:userId', surveys.showDemographicsMTurk)

module.exports = router
