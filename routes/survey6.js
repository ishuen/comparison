var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:userId', surveys.showSatisfaction)
router.get('/:env/:trial/:userId', surveys.showSatisfactionEnv)
router.post('/:trial/:userId', surveys.satisfactionSubmit)
router.post('/:env/:trial/:userId', surveys.satisfactionSubmitEnv)
module.exports = router
