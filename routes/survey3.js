var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/sf/', surveys.showDemographicsIVLE) // exp 2 new
router.get('/se/:userId', surveys.showDemographicsIVLE) // exp 1 only
router.get('/int/:userId', surveys.showDemographicsMTurk) // exp 1
router.get('/ins/:userId', surveys.showDemographicsMTurk) // exp 2
router.get('/inu/:userId', surveys.showDemographicsMTurk) // newExp 2
router.get('/:userId', surveys.showDemographics)

module.exports = router
